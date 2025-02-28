import { useState } from "react";
import { useWalletClient } from "wagmi";
import { usePopulatedSimulationState } from "../hooks/usePopulatedSimulationState";
import { useGetUserSDKVaultPositions } from "../hooks/useGetUserSDKVaultPosition";
import { Address, formatUnits, parseEther } from "viem";
import { depositUsingBundler, withdrawUsingBundler } from "../service/actions";
import { Vault } from "@morpho-org/blue-sdk";

export function VaultSdkView({ vaultAddress }: { vaultAddress: Address }) {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isFullWithdraw, setIsFullWithdraw] = useState(false);
  const [inputs, setInputs] = useState({
    amountToDeposit: "10",
    amountToWithdraw: "5",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const client = useWalletClient();

  const {
    simulationState,
    isPending: simulationIsPending,
    error: simulationError,
  } = usePopulatedSimulationState(vaultAddress);

  const {
    position,
    isLoading: positionLoading,
    error: positionError,
  } = useGetUserSDKVaultPositions(vaultAddress);

  const runDeposit = async () => {
    // Clear previous results first
    setTestResults([]);

    if (!client.data || !client.data.account) {
      setTestResults(["Please connect your wallet first"]);
      return;
    }

    if (simulationIsPending || !simulationState) {
      setTestResults((prev) => [
        ...prev,
        "Simulation state is still loading, please try again shortly.",
      ]);
      return;
    }

    if (simulationError) {
      setTestResults((prev) => [
        ...prev,
        `Error loading simulation state: ${simulationError}`,
      ]);
      return;
    }

    try {
      // Convert input values to BigInt using parseEther.
      const depositAmountWei = parseEther(inputs.amountToDeposit);
      const vault = await Vault.fetch(vaultAddress as Address, client.data);
      // Use the populated simulationState directly
      await depositUsingBundler(
        vault,
        client.data,
        simulationState,
        depositAmountWei
      );

      setTestResults((prev) => [
        ...prev,
        "Deposit via Bundler action executed successfully",
      ]);
    } catch (error: unknown) {
      console.error("Error during deposit action:", error);
      setTestResults((prev) => [
        ...prev,
        `Error: ${error instanceof Error ? error.message : String(error)}`,
      ]);
    }
  };

  const runWithdraw = async () => {
    setTestResults([]);

    if (!client.data || !client.data.account) {
      setTestResults(["Please connect your wallet first"]);
      return;
    }

    if (simulationIsPending || !simulationState) {
      setTestResults((prev) => [
        ...prev,
        "Simulation state is still loading, please try again shortly.",
      ]);
      return;
    }

    if (simulationError) {
      setTestResults((prev) => [
        ...prev,
        `Error loading simulation state: ${simulationError}`,
      ]);
      return;
    }

    try {
      const vault = await Vault.fetch(vaultAddress, client.data);

      let sharesToWithdraw: bigint;
      if (isFullWithdraw) {
        // For full withdraw, use the user's entire vault token balance
        if (!position) {
          throw new Error("Position data not available");
        }
        sharesToWithdraw = position.depositedAssets;
        // Update the input field to show the exact amount being withdrawn
        setInputs((prev) => ({
          ...prev,
          amountToWithdraw: formatUnits(position.depositedAssets, 18),
        }));
      } else {
        // For partial withdraw, convert the input amount to shares
        const amountToWithdraw = parseEther(inputs.amountToWithdraw);
        sharesToWithdraw = vault.toShares(amountToWithdraw);
      }

      await withdrawUsingBundler(
        vault,
        client.data,
        simulationState,
        sharesToWithdraw
      );

      setTestResults((prev) => [
        ...prev,
        "Withdraw via Bundler action executed successfully",
      ]);
    } catch (error: unknown) {
      console.error("Error during withdraw action:", error);
      setTestResults((prev) => [
        ...prev,
        `Error: ${error instanceof Error ? error.message : String(error)}`,
      ]);
    }
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Remove the grid-cols-3 to allow full width */}
      <div className="grid grid-cols-1 gap-8 mb-8">
        {/* Add a nested grid for the three cards */}
        <div className="grid grid-cols-3 gap-8">
          {/* Current Position Card */}
          <div className="bg-[#1E1E1E] rounded-lg p-6 border-[1.5px] border-gray-700">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <span className="mr-2">▲</span> Current Position
            </h2>
            {!client.data?.account ? (
              <div className="text-gray-500 text-sm">
                Please connect your wallet
              </div>
            ) : positionLoading ? (
              <div className="text-gray-500 text-sm">Loading position...</div>
            ) : positionError ? (
              <div className="text-red-500 text-sm">{positionError}</div>
            ) : position ? (
              <div className="space-y-4">
                <div className="bg-[#121212] border border-gray-700 rounded-md p-3">
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">
                        Vault Token Balance
                      </div>
                      <div className="font-medium">
                        {formatUnits(position.depositedAssets, 18)}{" "}
                        {position.vaultSymbol}
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-700">
                      <div className="text-sm text-gray-400 mb-1">
                        Underlying Equivalent
                      </div>
                      <div className="font-medium">
                        {formatUnits(
                          (position.depositedAssets *
                            position.shareToUnderlying) /
                            BigInt(1e18),
                          18
                        )}{" "}
                        {position.underlyingSymbol}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-sm">
                No position data available
              </div>
            )}
          </div>

          {/* Deposit Card */}
          <div className="bg-[#1E1E1E] rounded-lg p-6 border-[1.5px] border-gray-700">
            <h2 className="text-xl font-semibold mb-6">Deposit</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Deposit Amount (native units)
                </label>
                <input
                  type="text"
                  name="amountToDeposit"
                  value={inputs.amountToDeposit}
                  onChange={handleInputChange}
                  className="w-full bg-[#121212] border-[0.5px] border-gray-300 rounded p-2.5 text-sm"
                />
              </div>

              <button
                onClick={runDeposit}
                className="w-full !bg-blue-500 hover:bg-[#0045CC] text-white py-3 rounded-md font-medium mt-6 transition-colors"
              >
                Deposit
              </button>
            </div>
          </div>

          {/* Withdraw Card */}
          <div className="bg-[#1E1E1E] rounded-lg p-6 border-[1.5px] border-gray-700">
            <h2 className="text-xl font-semibold mb-6">Withdraw</h2>
            <div className="space-y-4">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="fullWithdraw"
                  checked={isFullWithdraw}
                  onChange={(e) => setIsFullWithdraw(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="fullWithdraw" className="text-sm text-gray-300">
                  Full Withdraw
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Withdraw Amount (native units)
                </label>
                <input
                  type="text"
                  name="amountToWithdraw"
                  value={
                    isFullWithdraw && position
                      ? formatUnits(position.depositedAssets, 18)
                      : inputs.amountToWithdraw
                  }
                  onChange={handleInputChange}
                  disabled={isFullWithdraw}
                  className={`w-full bg-[#121212] border-[0.5px] border-gray-300 rounded p-2.5 text-sm ${
                    isFullWithdraw ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                />
              </div>

              <button
                onClick={runWithdraw}
                className="w-full !bg-red-500 hover:bg-red-600 text-white py-3 rounded-md font-medium mt-6 transition-colors"
              >
                {isFullWithdraw ? "Withdraw All" : "Withdraw"}
              </button>
            </div>
          </div>
        </div>

        {/* Test Results Section */}
        <div className="bg-[#1E1E1E] rounded-lg p-6 border-[1.5px] border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {testResults.length > 0 ? (
              testResults.map((result, index) => (
                <div
                  key={index}
                  className="bg-[#121212] border border-gray-700 rounded-md p-2 text-sm"
                >
                  {result}
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-sm">
                No results to display yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

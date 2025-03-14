import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ProfileStore } from "../store/profile.store";


const WalletCard = ({ onClose , money }) => {  // Accept onClose prop
  const { AddBalance , WithdrawBalance , ProfileData , myProfile} = ProfileStore();

  useEffect(()=>{
    ProfileData();
  },[myProfile])

  const [amount, setAmount] = useState("");

  const handleAddMoney = async () => {
    const balance = parseFloat(amount);
    if (!isNaN(balance) && balance > 0) {
      const url = await AddBalance(balance);
      setAmount("");
      window.location.href = url;
    }
};

const handleWithdrawMoney = async () => {
    const balance = parseFloat(amount);
    if (!isNaN(balance) && balance > 0 && balance <= myProfile.wallet) {
      await WithdrawBalance(balance);
      setAmount("");
    }
};


  return (
    <motion.div 
      className="bg-[#2C2C2C] p-6 rounded-lg shadow-lg w-full mt-6 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Close Button */}
      <button 
        className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
        onClick={onClose}  // Close Popup
      >
        ✖
      </button>

      {/* Wallet Header */}
      <h3 className="text-lg font-semibold text-white text-center">My Wallet</h3>
      <p className="text-3xl font-bold text-green-400 text-center mt-2">₹{myProfile.wallet}</p>

      {/* Input for Amount */}
      <div className="mt-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter Amount"
          className="w-full p-2 rounded bg-[#3C3C3C] text-white border border-gray-600 focus:outline-none"
        />
      </div>

      <div className="mt-4 flex gap-4">
        <button
          onClick={handleAddMoney}
          className="w-1/2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Add Money
        </button>
        <button
          onClick={handleWithdrawMoney}
          className="w-1/2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Withdraw
        </button>
      </div>
    </motion.div>
  );
};

export default WalletCard;

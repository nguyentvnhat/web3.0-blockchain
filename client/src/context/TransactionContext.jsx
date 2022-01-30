import React, { useEffect, useState } from 'react';
import { ethers, providers } from 'ethers';

import { contractAddress, contractABI } from '../utils/constants';

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer  = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

    // send etherum successfully
    // console.log({
    //     provider,
    //     signer,
    //     transactionContract
    // });

    return transactionContract;
}

export const TransactionProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState('');
    const [formData, setFormData] = useState({ addressTo: '', amount: '', keyword: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));

    const handleChange = (e, name) => {
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
    }

    const checkIfWalletIsConnected = async () => {
        try {
            if (!ethereum) return alert("Please install metamark");
            const accounts = await ethereum.request({ method: 'eth_accounts' });

            if(accounts.length) {
                setCurrentAccount(accounts[0]);
                // getAllTransactions();
            } else {
                console.log("No accounts found");
            }
            console.log(accounts);
        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object.")   
        }
    }

    const connectWallet = async () => {
        try {
            if (!ethereum) return alert("Please install metamark ");

            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);
            throw new Error("No etherum object");
        }
    };

    const sendTransaction = async () => {
        try {
            if (!ethereum) return alert("Please install metamark ");

            // get data from form
            const { addressTo, amount, keyword, message } = formData;
            // hex to decimal 
            //eth-converter.com
            const transactionContract = getEthereumContract();
            const parsedAmount = ethers.utils.parseEther(amount);

            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: "0x5208", // 21000 GWEI
                    value: parsedAmount._hex,
                }]
            });

            const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

            setIsLoading(true);
            console.log(`Loading - ${transactionHash.hash} `);
            await transactionHash.wait();
            setIsLoading(false);
            console.log(`Success - ${transactionHash.hash} `);

            const transactionCount = await transactionContract.getTransactionCount();

            setTransactionCount(transactionCount.toNumber())

        } catch (error) {
            console.log(error);
            throw new Error("No etherum object");
        }
    };

    useEffect( () => {
        checkIfWalletIsConnected();
    }, []);

    return (
        // transfer value from this provider components via pros value 
        <TransactionContext.Provider value={{ connectWallet, currentAccount, formData, setFormData, handleChange, sendTransaction }}>
            {children}
        </TransactionContext.Provider>
    );
}
import './App.css';
import { ethers } from "ethers";
// import detectEthereumProvider from '@metamask/detect-provider';
// import { connect } from './GetBlockchain';
import { useState, useEffect } from 'react';

function App() {
    const [address, setAddress] = useState('0x...')
    const [signer, setSigner] = useState('');
    const [contract, setContract] = useState('');

    const connect = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum); //await detectEthereumProvider();
        const accounts = await provider.send("eth_requestAccounts", []); //await provider.request({ method: 'eth_requestAccounts' });
        // const account = accounts[0];
        const account = handleAccountsChanged(accounts);
        const signer = provider.getSigner();

        setAddress(account);
        setSigner(signer);
        console.log(account)
    }

    const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0 ) {
            console.log("Please connect to metamask")
        } else {
            window.ethereum.on("accountsChanged", () => { window.location.reload() });
            return accounts[0];
        }
    }

    const getContract = () => {
        const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);//new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
        const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
        const contractABI = [
            "function sign(string memory _message)",
            "function getGuestCount() public view returns (uint)",
            "function getGuests(uint id) public view returns (tuple(address sender, string message))",
            // "function getGuests(uint id) public view returns (tuple(address sender, string message) guest)"

        ];
        let contract = new ethers.Contract(
            contractAddress,
            contractABI,
            ethersProvider
          )
        //   console.log(ethersProvider);
          setContract(contract);
    }

    // console.log(ethers);

    useEffect(() => {
        getContract();
        // console.log(contract)
    }, [])

    // useEffect( () => {
    //     ( async () => {
    //       const address = await connect()
    //       console.log(address)
    //     })()
    
    //   }, [])

    const signMessage = async () => {
        const contractWithSigner = contract.connect(signer);
        const tx = await contractWithSigner.sign('aweaweawe')
        console.log(await tx);
    }

    const getGuestCount = async () => {
        // console.log(await contract.getGuestCount())
        const guestCountBN = await contract.getGuestCount();
        const guestCount = guestCountBN.toString();
        // console.log(ethers.BigNumber.from(guestCount))
        // const count = await ethers.utils.BigNumber.from(guestCount)
        console.log(guestCount);
    }

    const getGuests = async () => {
        const getGuests = await contract.getGuests(0);
        console.log(getGuests.sender);
        console.log(getGuests.message);

    }

    return (
        <div>
            <h1> Blockchain Guestbook </h1>
            <p>Leave a message in my Sepolia Testnet Guestbook</p>
            <button onClick={signMessage}>sign</button>
            <button onClick={getGuestCount}>getGuestCount</button>
            <button onClick={getGuests}>getGuests</button>
            <button onClick={connect}>Connect Wallet</button>
            <h4>Current connected Address: {address}</h4>
            <form>
                <label>Type message for Guestbook</label>
                <input />
                <button>Sign message for Guestbook</button>
            </form>
        </div>
    )
}

export default App;
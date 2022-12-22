import './App.css';
import { ethers } from "ethers";
// import detectEthereumProvider from '@metamask/detect-provider';
import { useState, useEffect } from 'react';

let guestMessages = [];

function App() {
    const [address, setAddress] = useState('0x...')
    const [provider, setProvider] = useState();
    const [signer, setSigner] = useState('');
    const [contract, setContract] = useState('');
    const [guestCount, setGuestCount] = useState(0);
    const [message, setMessage] = useState('');
    // const [guestMessages, setGuestMessages] = useState([]);


    const connect = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum); //await detectEthereumProvider();
        const accounts = await provider.send("eth_requestAccounts", []); //await provider.request({ method: 'eth_requestAccounts' });
        // const account = accounts[0];
        const account = handleAccountsChanged(accounts);
        const signer = provider.getSigner();

        setAddress(account);
        setSigner(signer);
        // console.log(account)
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
        const provider = new ethers.providers.Web3Provider(window.ethereum  || 'http://localhost:8545');//new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
        const contractAddress = "0x547382C0D1b23f707918D3c83A77317B71Aa8470" //"0x5FbDB2315678afecb367f032d93F642f64180aa3";
        const contractABI = [
            "function sign(string memory _message)",
            "function getGuestCount() public view returns (uint)",
            "function getGuests(uint id) public view returns (tuple(address sender, string message))",
            "event NewGuest(uint guestId, address sender, string message)",
        ];

        let contract = new ethers.Contract(
            contractAddress,
            contractABI,
            provider
          )

        // setProvider(provider)
        setContract(contract);
    }


    useEffect(() => {
        ( async () => {

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            setProvider(provider);

            if(provider) {
                getContract();
                getGuests();  
            }

        })()

    }, [guestCount,signer])

    const signMessage = async (event) => {
        event.preventDefault();
        const contractWithSigner = contract.connect(signer);
        let tx = await contractWithSigner.sign(message)
        console.log(await tx);
        setMessage('');
    }

    const getGuestCount = async () => {

        const guestCountBN = await contract.getGuestCount();
        const guestCount = guestCountBN.toString();

        setGuestCount(guestCount);
    }

    const getGuests = async () => {

        for (let i = 1; i <= guestCount; i++) {
            // console.log(await contract.getGuests(i));
            let guests = await contract.getGuests(i);
            guestMessages.push(guests)
            // setGuestMessages(guests);
        }
    }
    
    const filter = {
        address: "0x547382C0D1b23f707918D3c83A77317B71Aa8470",//"0x5FbDB2315678afecb367f032d93F642f64180aa3",
        topics: [
            // the name of the event, parnetheses containing the data type of each event, no spaces
            // utils.id("NewGuest(uint, address, string)")
        ]
    }

    if(contract) {
            getGuestCount();
            // getGuests();
            provider.on(filter, () => {
                getGuestCount();
            })
    };

    const handleChange = (event) => {
        // event.preventDefault()
        setMessage(event.target.value);
    }
    // console.log(provider)
    return (
        <div className='container'>
            <h1> Web3 Guestbook </h1>
            <p>Leave a message in my Sepolia Testnet Guestbook</p>
            <div>Amount of Guests who has left a message: {guestCount}</div>
            <button onClick={connect}>Connect Wallet</button>

            <h4>Current connected Address: {address}</h4>
            <form onSubmit={signMessage}>
                <label>Message for the Guestbook</label>
                <input value={message} onChange={handleChange} />
                <button>Sign message</button>
            </form>
            <div >
                {guestMessages.map((msgs, i) => {
                    return (
                        <div className='card' key={i}>
                            <div>Guestbook Entry {i + 1}</div>
                            <div>{msgs['sender']}</div>
                            <div>{msgs['message']}</div>
                            <br />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default App;
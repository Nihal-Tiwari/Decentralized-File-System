import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import {useState, useEffect} from "react";
import { ethers } from "ethers";
import { Web3Provider } from '@ethersproject/providers';
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";
import "./App.css";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const loadProvider = async () => {
      if (!window.ethereum) {
        console.error('No web3 provider detected');
        return;
      }
      const provider = new Web3Provider(window.ethereum);
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        const contractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
        const contract = new ethers.Contract(contractAddress, Upload.abi, signer);
        console.log(contract);
        setContract(contract);
        setProvider(provider);

        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
      } catch (error) {
        console.error(error);
      }
    };
    loadProvider();
  }, []);

  return (
    <>
   {!modalOpen && (
      <button className="share" onClick={() => setModalOpen(true)}>
        Share
        </button>
        )}
     {modalOpen && ( 
     <Modal setModalOpen={setModalOpen} contract={contract}></Modal>
     )}
    <div className="App">
      <h1 style={{color:"white"}}>Decentralized File System</h1>
      <div className="bg"></div>
      <div className="bg bg2"></div>
      <div className="bg bg3"></div>

      <p style={{color:"white"}}>Account : {account ? account:"Please connect metamask"}</p>
      <FileUpload 
        account={account} 
        provider={provider} 
        contract={contract}
      ></FileUpload>
      <Display contract={contract} account={account}></Display>
    </div></>
  );
}

export default App;

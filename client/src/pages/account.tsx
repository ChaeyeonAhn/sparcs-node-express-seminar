import React from "react";
import Header from "../components/header";
import axios from "axios";
import {SAPIBase} from "../tools/api";
import "./css/account.css";

interface IAPIResponse  { id: number, title: string, content: string }

const AccountPage = () => {
  const [ username, setUSERNAME ] = React.useState<string>("");
  const [ password, setPASSWORD ] = React.useState<string>("");
  const [ spend, setSPEND ] = React.useState<string>("");
  const [ purpose, setPURPOSE ] = React.useState<string>("");
  const [ LAPIResponse, setLAPIResponse ] = React.useState<IAPIResponse[]>([]);
  const [ NPostCount, setNPostCount ] = React.useState<number>(0);

  const [ NBalance, setNBalance ] = React.useState<number | "Not Authorized">("Not Authorized");
  const [ NTransaction, setNTransaction ] = React.useState<number>(0);

  const getAccountInformation = () => {
    const asyncFun = async() => {
      interface IAPIResponse { balance: number };
      const { data } = await axios.post<IAPIResponse>(SAPIBase + '/account/getInfo', { credentialID: username, credentialPW: password });
      setNBalance(data.balance);
    }
    asyncFun().catch((e) => window.alert(`AN ERROR OCCURED: ${e}`));
  }

  const performTransaction = ( amount: number ) => {
    const asyncFun = async() => {
      interface IAPIResponse { success: boolean, balance: number, msg: string };
      const { data } = await axios.post<IAPIResponse>(SAPIBase + '/account/transaction', { credentialID: username, credentialPW: password, amount: amount });
      setNTransaction(0);
      if (!data.success) {
        window.alert('Transaction Failed:' + data.msg);
        return;
      }
      window.alert(`Transaction Success! ₩${ NBalance } -> ₩${ data.balance }\nThank you for using SPARCS Bank`);
      setNTransaction(0);
      setNBalance(data.balance);
    }
    asyncFun().catch((e) => window.alert(`AN ERROR OCCURED: ${e}`));
  }

  React.useEffect( () => {
    let BComponentExited = false;
    const asyncFun = async () => {
      // const { data } = await axios.get<IAPIResponse[]>( SAPIBase + `/getFeed?count=${ NPostCount }`);
      const data = [ { id: 0, title: "test1", content: "Example body" }, { id: 1, title: "test2", content: "Example body" }, { id: 2, title: "test3", content: "Example body" } ].slice(0, NPostCount);
      if (BComponentExited) return;
      setLAPIResponse(data);
    };
    asyncFun().catch((e) => window.alert(`Error while running API Call: ${e}`));
    return () => { BComponentExited = true; }
  }, [ NPostCount ]);

  const createNewPost = () => {
    const asyncFun = async () => {
      await axios.post( SAPIBase + '/postFeed2', { spend: spend, purpose: purpose } );
      setNPostCount(NPostCount + 1);
      setSPEND("");
      setPURPOSE("");
    }
    asyncFun().catch(e => window.alert(`AN ERROR OCCURED! ${e}`));
  }

  const deletePost = (id: string) => {
    const asyncFun = async () => {
      // One can set X-HTTP-Method header to DELETE to specify deletion as well
      await axios.post( SAPIBase + '/deleteFeed2', { id: id } );
      
    }
    asyncFun().catch(e => window.alert(`AN ERROR OCCURED! ${e}`));
  }

  const modifyPost = (id: string) => {
    const asyncFun = async () => {
      await axios.post( SAPIBase + '/modifyFeed2', { id: id, spend: spend, purpose: purpose });
      setSPEND("");
      setPURPOSE("");
    }
    asyncFun().catch(e => window.alert(`AN ERROR OCCURED! ${e}`));
  }

  return (
    <div className={"account"}>
      <Header/>
      <h2>Account</h2>
      <div className={"account-token-input"}>
        Enter Username: <input type={"text"} value={username} onChange={e => setUSERNAME(e.target.value)}/>
        <br />
        Enter Password: <input type={"text"} value={password} onChange={e => setPASSWORD(e.target.value)}/>
        <button onClick={e => getAccountInformation()}>GET</button>
      </div>
      <div className={"account-bank"}>
        <h3>The National Bank of SPARCS API</h3>
        <div className={"balance"}>
          <p className={"balance-title"}>Current Balance</p>
          <p className={"balance-value " + (typeof(NBalance) === "number" ? (NBalance >= 0 ? "balance-positive" : "balance-negative") : "")}>₩ { NBalance }</p>
        </div>
        <div className={"transaction"}>
          ₩ <input type={"number"} value={NTransaction} min={0} onChange={e => setNTransaction(parseInt(e.target.value))}/>
          <button onClick={e => performTransaction(NTransaction)}>DEPOSIT</button>
          <button onClick={e => performTransaction(NTransaction * -1)}>WITHDRAW</button>
        </div>
      </div>

      <h2>가계부</h2>
      <div className={"account-book-input"}>
        얼마나 사용?: <input type={"text"} value={spend} onChange={e => setSPEND(e.target.value)}/>
        <br />
        어디다가 사용?: <input type={"text"} value={purpose} onChange={e => setPURPOSE(e.target.value)}/>
      </div>
      <div className={"post-add-button"} onClick={(e) => createNewPost()}>Add Post!</div>

      { LAPIResponse.map( (val, i) =>
          <div key={i} className={"book-item"}>
            <div className={"delete-item"} onClick={(e) => deletePost(`${val.id}`)}>ⓧ</div>
            <div className={"modify-item"} onClick={(e) => modifyPost(`${val.id}`)}>✎</div>
            <h3 className={"account-book-title"}>{ val.title }</h3>
            <p className={"account-book-body"}>{ val.content }</p>
          </div>
        ) }
    </div>
  );
}

export default AccountPage;
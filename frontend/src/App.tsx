import './App.css'
import logo from '../../frontend/src/assets/logo.png';
import UrlForm from "./components/UrlForm.tsx";
import {useEffect, useState} from "react";
import {fetchLinks} from "../api/links.ts";
import React from "react";
import LinksHistory from "./components/LinksHistory.tsx";



function App() {

    const [links, setLinks] = useState([]);
    const [createdLink, setCreatedLink] = useState(null);

    const getLinks = async() => {
        const result = await fetchLinks();
        setLinks(result);
    }

    const onFormSubmitted = (result : any) => {
        console.log(result);
        if (result?.shortname !== null && result?.shortname !== undefined) {
            setCreatedLink(result.shortname);
        }
    }

    useEffect(() => {
        getLinks();
    }, []);


    return (
       <div className="d-flex flex-column gap-2">
        <div className="d-flex flex-column align-items-center gap-3 mt-5 m-4 p-1">
          <img className="logo" src={logo}/>
          <div className="fw-bolder" >Сокращаем ссылку для удобства</div>
          <UrlForm onFormSubmitted={onFormSubmitted}/>
        </div>

       {
            createdLink !== null ?
                <div className="links-container container d-flex flex-column gap-4 m-2">
                   <div className="links-container__caption fw-bolder d-flex gap-3 justify-content-center">
                       Ваша ссылка: <a href={createdLink}>{createdLink}</a>
                   </div>
                </div> :
                <React.Fragment key={Math.random()} />
       }

       <LinksHistory links={links} />


      </div>
    )
}

export default App

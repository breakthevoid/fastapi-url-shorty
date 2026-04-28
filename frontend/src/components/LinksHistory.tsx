import {useEffect} from "react";

function LinksHistory({
                        links
                      } : {links: object}) {


    useEffect(() => {
        console.log('typeof links: ' + typeof links);



    }, []);

    return (
        <div className="links-container container d-flex flex-column gap-4 m-3" style={{maxWidth: '97%'}}>
           <div className="links-container__caption fw-bolder">
               История ссылок
           </div>

           <div className="links-container__content d-flex flex-column gap-3" style={{fontSize: "14px"}}>
           {
               links !== null && links.map((link : object) => (
                   <div key={link.id} className="links-container__item d-flex flex-row w-100 card p-3 gap-1 justify-content-between">
                       <div className="d-flex flex-column w-100 gap-4">

                           <div className="d-flex flex-row justify-content-between">
                               <div className="d-flex flex-row gap-4 text-break text-start" style={{width: "40%"}}>
                                   <div>Источник:</div>
                                   <div className="w-75">
                                       <a className="text-black" href={
                                           link.fullname
                                       }> {link.fullname} </a>
                                   </div>
                               </div>

                               <div className="d-flex flex-row w-40 gap-4" style={{width: "40%"}}>
                                   <div>Ссылка:</div>
                                   <div>
                                        <a className="text-black text-start" href={
                                               link.shortname
                                        }> {link.shortname} </a>
                                   </div>
                               </div>
                           </div>

                           <div className="d-flex flex-row w-40 gap-2 justify-content-end">
                               <div>Создана:</div>
                               <div>
                                   {new Date(link.created_at).toLocaleString('ru-RU')}
                               </div>
                           </div>
                       </div>
                   </div>
               ))
           }
           </div>


       </div>
    )
}

export default LinksHistory;

import "./LoadMore.scss";
import {Button} from "primereact/button";
import React, {useEffect, useRef, useState} from "react";
import LoadMoreLottie from "./LoadMoreLottie.jsx";

function LoadMore({
                      objects,
                      meta,
                      getObjects,
                      page = null,
                      startIsLoading,
                      auto = true,
                      animation  = <LoadMoreLottie height={100} width={100}/>,
                      icon = <img src="/storage/public/static/caretdown.png"/>,
                      title = "Загрузить еще"
                  }) {

    const loadMoreRef = useRef(null);
    const loadMoreWrapperRef = useRef(null);
    const [isLoading, setIsLoading] = useState(startIsLoading);

    const handleLoadNextPage = async(evt) => {
        if (evt !== null)
            evt.preventDefault();
        //console.log('handleLoadNextPage');
        //console.log('meta: ' + JSON.stringify(meta));
        //console.log('subjects: ' + JSON.stringify(subjects));

        const currentPage = meta.current_page;
        const lastPage = meta.last_page;

        //console.log('currentPage: ' + currentPage);
        //console.log('lastPage: ' + lastPage);

        /*if (currentPage <= 1) {
            loadMoreRef.current.style.display = 'block';
        }*/

        if (currentPage < lastPage) {
            window.removeEventListener('scroll', loadMore);
            if (page === null) {
                await getObjects(currentPage + 1);
            } else {
                await getObjects(page);
            }

            setIsLoading(false);
        }
    };

    const loadMore = async() => {
        if (loadMoreWrapperRef.current !== undefined) {
            console.log('window.innerHeight: ' + window.innerHeight);
            console.log('window.scrollY: ' + window.scrollY);
            var bodyRect = document.body.getBoundingClientRect(),
                elemRect = loadMoreWrapperRef.current?.getBoundingClientRect(),
                offset   = elemRect?.top - bodyRect.top;
            console.log('offset: ' + offset);
            if (window.innerHeight + window.scrollY >= offset) {
                console.log('here');
                setIsLoading(true);
                await handleLoadNextPage(null);
            }
        }
    }

    useEffect(() => {
        const currentPage = meta?.current_page;
        const lastPage = meta?.last_page;
        if (objects?.length > 0 && currentPage !== lastPage && auto) {
            //console.log('currentPage: ' + currentPage);
            //console.log('lastPage: ' + lastPage);
            window.addEventListener('scroll', loadMore);
            //console.log('add Eventlistener scroll');
        }
    }, [objects]);

    useEffect(() => {
        const currentPage = meta?.current_page;
        const lastPage = meta?.last_page;
        //console.log('meta currentPage: ' + currentPage);
        //console.log('meta lastPage: ' + lastPage);

        if (currentPage <= 1 && loadMoreRef.current) {
            loadMoreRef.current.style.display = 'block';
            //console.log('button block');
        }

        if (currentPage === lastPage && loadMoreRef.current) {
            //console.log('button none');
            loadMoreRef.current.style.setProperty("display", "none", "important");
        }
    }, [meta]);

    useEffect(() => {
        return () => {
            if (auto) {
                window.removeEventListener('scroll', loadMore);
            }
        }
    }, []);


    return (
        <>

            <div className="load-more__control" ref={loadMoreWrapperRef}>
                {!auto ?
                    <Button
                        type="button"
                        onClick={handleLoadNextPage}
                        ref={loadMoreRef}
                        className="profiles-list__btn"
                        style={auto ? {display: "none" } : {display: "block"}}
                    >{title}
                    {icon}
                    </Button> :  <React.Fragment key={Math.random()}/>
                }
            </div>


            {
                isLoading && auto ? (
                   animation
                ) : (<React.Fragment key={Math.random()}/>)
            }
        </>
    )
}

export default LoadMore;
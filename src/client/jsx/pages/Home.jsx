import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { Masonry } from "../components/masonry.jsx";
import { Button, SelectableButton } from "../components/button.jsx";
import { API } from "../../api.js";
import { Post } from "../../data/post.jsx";
import { LogoIcon } from "../../assets/icons/logo.jsx";

import "./Home.css"



class Category {
    // for infinite scrolling behvaior.
    pageCount = 0;

    isAllLoaded = false;

    constructor(id, displayName) {
        this.id = id;
        this.displayName = displayName;
    }

    /**
     * @param {number} pageNum 
     * @returns {}
     */
    async load(pageNum = this.pageCount++) {
        return this.fetch(pageNum);
    }
    
    /**
     * @param {number} pageNum 
     * 
     * @returns {Promise<Post[]>}
    */
    async fetch(pageNum) {
        const params = new URLSearchParams();
        params.set("category", this.id === "all" ? "" : this.id);
        params.set("pageNum", "1"); // from 1 to infinity.
        params.set("sort", "new");

        const response = await fetch(`${API.endpoint}/posts?${params}`);
        if (!(response.ok || response.status === 200)) {
            this.isAllLoaded = true;

            throw new Error(`reponse status ${response.status}`);
        }

        return Post.parseByList((await response.json()).responseData);
    }
}

const categorys = [
    new Category("all", "전체"),
    new Category("notice", "공지"),
    new Category("2020", "2020's"),
    new Category("2010", "2010's"),
    new Category("2000", "2000's"),
    new Category("1990", "1990's"),
    new Category("1980", "1980's"),
    new Category("1970", "1970's"),
]

export const HomePage = () => {
    const navigate = useNavigate();

    const params = new URLSearchParams(useLocation().search);
    const type   = params.get("category") ?? "all";

    /** @type {[Post[], React.Dispatch<React.SetStateAction<Post[]>>]} posts */
    const [ posts, setPosts ] = useState([]);

    useEffect(() => {
        const category = categorys.find(it => it.id === type);
        const posts = category?.fetch() ?? [];

        posts.then(setPosts);
    }, [type]);

    return (
        <>
            <Header />
            <div className="row-scrollable" style={{
                position: "sticky",
                top: "0px",
                zIndex: 1,
                display: "flex",
                padding: "var(--padding)",
                gap: "var(--gap)",
                backgroundColor: "var(--background)",
            }}>
                {categorys.map(it => {
                    return (
                        <Button.Selectable text={it.displayName} isSelected={type === it.id} onSelect={() => navigate(`?category=${it.id}`)} />
                    );
                })}
            </div>
            <div style={{padding: "var(--padding)"}}>
                <Masonry rows={5} gap="var(--gap)">
                    {posts.map(post => <PostItem post={post} />)}
                </Masonry>
            </div>
        </>
    )
}

/** @type {React.FC} */
const Header = () => {
    return (
        <div className="header">
            <LogoIcon />
            <div className="nav">
                <Button.Tertiary text="쓰레드" sub="NEW" onClick={() => { console.log("hello world") }} />
                <Button.Tertiary text="채팅" onClick={() => { console.log("hello world") }} />
                <Button.Tertiary text="로그인 하기" onClick={() => { console.log("hello world") }} />
            </div>
        </div>
    )
}

/**
 * @type {React.Fc}
 * @param {{post: Post}}
 */
const PostItem = ({post}) => {
    return (
        <div className="post_item">
            <div className="clamp-profile">
                <img src={post.img} alt="post profile" />
                <div className="inner-shadow"></div>
            </div>
            <div>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "var(--column-spacing)",
                }}>
                    <p>#{post.category}</p>
                    <p>{post.viewCount}회</p>
                </div>
                <div>
                    <div className="title">{post.title}</div>
                    <div>{post.content}</div>
                </div>
            </div>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignContent: "center",
            }}>
                <div style={{fontSize: "12px", color: "var(--foreground2)"}}>{post.nickname}</div>
                <div style={{fontSize: "12px", color: "var(--foreground3)"}}>2024.02.13</div>
            </div>
        </div>
    )
}
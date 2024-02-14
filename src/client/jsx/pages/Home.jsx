import React, { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { Masonry } from "../components/masonry.jsx";
import { Button, SelectableButton } from "../components/button.jsx";
import { API } from "../../api.js";
import { Post } from "../../data/post.jsx";
import { LogoIcon } from "../../assets/icons/logo.jsx";
import { NumberUtil } from "../../util/number.jsx";
import { ArrayUtil } from "../../util/array.jsx";
import { Disable } from "../components/disable.jsx";
import { Image } from "../../data/image.jsx";

import "./Home.css";

class Category {
    pageCount = 1;

    // 다음 페이지에 해당하는 포스트의 수.
    nextPageItemCount = 0;
    
    cachedPosts = null;

    // 카테고리 관련 포스트를 더 로드해야 하는 경우의 여부를 반환합니다.
    get canLoadMore() {
        return this.nextPageItemCount != 0;
    }

    constructor(id, displayName) {
        this.id = id;
        this.displayName = displayName;
    }

    /**
     * @param {number} pageNum 
     * @returns {Promise<Post[]>}
     */
    async load(pageNum = this.pageCount) {
        return this.cachedPosts ?? (this.cachedPosts = await this.fetch(pageNum));
    }

    async loadMore(pageNum = ++this.pageCount) {
        
    }
    
    /**
     * @param {number} pageNum
     * @returns {Promise<Post[]>}
    */
    async fetch(
        pageNum = this.pageCount
    ) {
        const params = new URLSearchParams();
        params.set("category", this.id === "all" ? "" : this.id);
        params.set("pageNum", pageNum); // from 1 to infinity.
        params.set("sort", "new");
        
        const response = await fetch(`${API.endpoint}/posts?${params}`);
        if (!(response.ok || response.status === 200)) {
            this.nextPageItemCount = 0;

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
    const [ posts, setPosts ] = useState(null);
    const [ disabled, setDisabled ] = useState(false);

    useEffect(() => {
        setDisabled(true);

        (async () => {
            const category = categorys.find(it => it.id === type);
            const posts = await category?.load() ?? [];

            setPosts(posts);
            setDisabled(false);
        })()
    }, [type]);

    const postElement = () => {
        if (posts) {
            return [
                posts.map(post => <PostItem post={post} />), // loaded
                ArrayUtil.builder(6, () => <PostPlaceholder />) // placeholder
            ]
        }

        // 초기 로딩 시
        return ArrayUtil.builder(30, () => <PostPlaceholder />)
    }

    return (
        <>
            <Header />
            <div className="categorys row-scrollable">
                {categorys.map(it => {
                    return (
                        <Button.Selectable
                            text={it.displayName}
                            isSelected={type === it.id}
                            onSelect={() => navigate(`?category=${it.id}`)}
                        />
                    );
                })}
            </div>
            <Disable isDisabled={disabled}>
                <div style={{padding: "var(--padding)"}}>
                    <Masonry rows={5} gap="var(--grid-gap)">{postElement()}</Masonry>
                </div>
            </Disable>
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
 * 클라이언트가 서버에게 요청하여 포스트 정보의 응답을 기다리고 있을 경우,
 * 사용자에게 이를 시각적으로 표시하기 위해 사용됩니다.
 * 
 * @type {React.FC}
 */
const PostPlaceholder = () => {
    const height = NumberUtil.random(150, 300);
    const width1 = NumberUtil.random(30, 80);
    const width2 = NumberUtil.random(50, 100);

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            padding: "var(--padding)",
            gap: "var(--column-spacing)",
        }}>
            <div style={{height: height}} className="placeholder"></div>
            <div style={{height: "20px", width: `${width1}%`}} className="placeholder-inner"></div>
            <div style={{height: "15px", width: `${width2}%`}} className="placeholder-inner"></div>
        </div>
    )
}

/**
 * @type {React.FC}
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
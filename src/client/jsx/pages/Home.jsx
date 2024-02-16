import React, { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { Masonry } from "../components/masonry.jsx";
import { Button } from "../components/button.jsx";
import { API } from "../../api.js";
import { Post } from "../../data/post.js";
import { LogoIcon } from "../../assets/icons/logo.jsx";
import { NumberUtil } from "../../util/number.jsx";
import { ArrayUtil } from "../../util/array.jsx";
import { Disable } from "../components/disable.jsx";
import { Constraint, SizeBuilder } from "../components/size_builder.jsx";
import { Listener } from "../components/listener.jsx";

import "./Home.css";
import { AsyncImg } from "../components/async_img.jsx";

class Category {
    constructor(id, displayName) {
        this.id = id;
        this.displayName = displayName;
        this.pageCount = 1;
        this.nextPageItemCount = 0; // 다음 페이지에 해당하는 포스트의 수.
        this.cachedPosts = null;
    }

    // 카테고리 관련 포스트를 더 로드해야 하는 경우의 여부를 반환합니다.
    get canLoadMore() {
        return this.isLoading == false && this.nextPageItemCount != 0;
    }

    /**
     * @param {number} pageNum
     * @returns {Promise<Post[]>}
     */
    async load(pageNum = this.pageCount) {
        return this.cachedPosts ?? (this.cachedPosts = await this.fetch(pageNum));
    }

    async loadMore(pageNum = ++this.pageCount) {
        if (this.canLoadMore == false) {
            throw new Error("추가적인 페이지 로드가 필요하지 않습니다.");
        }

        console.log("load more");
    }
    
    /**
     * @param {number} pageNum
     * @returns {Promise<Post[]>}
    */
    async fetch(
        pageNum = this.pageCount
    ) {
        this.isLoading = true;

        const params = new URLSearchParams();
        params.set("category", this.id === "all" ? "" : this.id);
        params.set("pageNum", pageNum); // from 1 to infinity.
        params.set("sort", "new");
        
        const response = await fetch(`${API.endpoint}/posts?${params}`);
        if (!(response.ok || response.status === 200)) {
            this.nextPageItemCount = 0;

            throw new Error(`reponse status ${response.status}`);
        }

        this.isLoading = false;

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
    const type = params.get("category") ?? "all";
    const sort = params.get("sort") ?? "view";

    /** @type {[{parent: Category, posts: Post[]}, React.Dispatch<React.SetStateAction<Post[]>>]} posts */
    const [ contents, setContents ] = useState(null);
    const [ disabled, setDisabled ] = useState(false);

    /** @type {() => Category?} */
    const currentCategory = () => {
        return categorys.find(it => it.id === type);
    }

    // 카테고리 또는 정렬 기준별 포스트 불러오기.
    useEffect(() => {
        setDisabled(true);

        (async () => {
            const target = currentCategory();
            const posts = await target?.load() ?? [];

            setContents({parent: target, posts: posts});
            setDisabled(false);
        })()
    }, [type, sort]);
    
    const createPostItems = () => {
        if (contents) {
            if (contents.posts.length == 0) {
                return undefined;
            }

            return [
                // 최종적으로 응답된 포스트들.
                contents.posts.map(post => <PostItem post={post} />),

                // 다음 페이지의 포스트 갯수 만큼 Placeholder를 표시합니다.
                ArrayUtil.builder(15, () => {
                    return (
                        <Listener.Intersection callback={() => {
                            if (contents.parent.canLoadMore) contents.parent.loadMore();
                        }}>
                            <PostPlaceholder />
                        </Listener.Intersection>
                    )
                })
            ]
        }

        // 초기 로딩 시
        return ArrayUtil.builder(15, () => <PostPlaceholder />)
    }

    return (
        <>
            <Header />
            <div className="categorys row-scrollable" style={{pointerEvents: disabled ? "none" : null}}>
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
            <Disable isDisabled={contents ? disabled : false}>
                <div style={{padding: "var(--padding)"}}>
                    <SizeBuilder
                        constraints={[
                            new Constraint(1000, Infinity, 5),
                            new Constraint(800, 1000, 4),
                            new Constraint(600, 800, 3),
                            new Constraint(400, 600, 2),
                            new Constraint(-Infinity, 400, 1),
                        ]}
                        builder={(rows) => {
                            return <Masonry rows={rows} gap="var(--grid-gap)">{createPostItems()}</Masonry>
                        }
                    } />
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
    const height = useRef(NumberUtil.random(150, 300)).current;
    const width1 = useRef(NumberUtil.random(30, 80)).current;
    const width2 = useRef(NumberUtil.random(50, 100)).current;

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
                <AsyncImg src={post.img} isLazyLoad={true}></AsyncImg>
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
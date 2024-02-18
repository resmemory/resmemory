import "./Home.css";

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
import { AsyncImg } from "../components/async_img.jsx";
import { Option, OptionSelector } from "../components/option_selector.jsx";

/**
 * @typedef {React.Dispatch<React.SetStateAction<Category>>} SetStatePost
 */

class Category {
    constructor(id, displayName) {
        this.id = id;
        this.displayName = displayName;
        this.pageCount = 1;
        this.nextItemCount = 0; // 다음 페이지에 해당하는 포스트의 수.
        this.posts = null;
    }

    get length() {
        return this.posts?.length ?? 0;
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
        return this.posts ?? (this.posts = await this.fetch(pageNum));
    }

    async loadMore(pageNum = ++this.pageCount) {
        if (this.canLoadMore == false) {
            throw new Error("추가적인 페이지 로드가 필요하지 않습니다.");
        }

        this.posts.push(...(await this.fetch(pageNum)));
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

        { // 응답 데이터 파싱 후 포스트 데이터를 반환합니다.
            const responseData = (await response.json())["responseData"];
            this.nextItemCount = responseData["nextItemCount"];
            
            return Post.parseByList(responseData["posts"]);
        }
    }

    /**
     * @param {SetStatePost} setState
     * @returns
     */
    createElements(setState) { 
        if (this.posts == null) {
            return ArrayUtil.builder(15, (_, i) => (<div key={i}><PostPlaceholder /></div>));
        }
        if (this.posts.length == 0) {
            return undefined;
        }

        return [
            // 최종적으로 응답된 포스트들.
            this.posts.map(post => <PostItem post={post} />),
            
            // 다음 페이지의 포스트 갯수 만큼 Placeholder를 표시합니다.
            ArrayUtil.builder(this.nextItemCount, () => {
                return (
                    <PostPlaceholder onVisible={() => {
                        if (this.canLoadMore) {
                            this.loadMore().then(() => setState({current: this}));
                        }
                    }} />
                )
            })
        ]
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
    const params = new URLSearchParams(useLocation().search);
    const type = params.get("category") ?? "all";
    const sort = params.get("sort") ?? "view";

    /** @type {Category} */
    const category = categorys.find(it => it.id === type);

    /** @type {[{current: Category}, React.Dispatch<React.SetStateAction<Category>>]} */
    const [ contents, setContents ] = useState({current: category});
    const [ disabled, setDisabled ] = useState(false);

    // 카테고리 또는 정렬 기준별 포스트 불러오기.
    useEffect(() => {
        setDisabled(true);

        category.load().then(_ => {
            setContents({current: category});
            setDisabled(false);
        });
    }, [type, sort]);

    return (
        <>
            <title>그땐 G:Then</title>
            <Header />
            <HeaderNotice />
            <HeaderSelector type={type} disabled={disabled} />
            <Disable isDisabled={contents.current.posts ? disabled : false}>
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
                            return <Masonry rows={rows}>{contents.current.createElements(setContents)}</Masonry>
                        }
                    } />
                </div>
            </Disable>
        </>
    )
}

/** @type {React.FC} */
const HeaderNotice = () => {
    return (
        <div className="header-notice">📢 사이트 개발 중...</div>
    )
}

/** @type {React.FC} */
const Header = () => {
    return (
        <div className="header">
            <LogoIcon />
            <div className="nav">
                <Button.Tertiary text="쓰레드" isNew={true} onClick={() => { console.log("hello world") }} />
                <Button.Tertiary text="채팅" onClick={() => { console.log("hello world") }} />
                <Button.Tertiary text="로그인 하기" onClick={() => { console.log("hello world") }} />
            </div>
        </div>
    )
}

/** @type {React.FC} */
const HeaderSelector = ({type, disabled}) => {
    const navigate = useNavigate();

    return (
        <div className="header_selector">
            <div className="categorys row-scrollable" style={{pointerEvents: disabled ? "none" : null}}>
                {categorys.map(it => {
                    return (
                        <div key={it.id}>
                            <Button.Selectable
                                text={it.displayName}
                                isSelected={type === it.id}
                                onSelect={() => navigate(`?category=${it.id}`)}
                            />
                        </div>
                    );
                })}
            </div>
            <div style={{
                minWidth: "max-content",
                marginLeft: "auto",
                marginTop: "auto",
                marginBottom: "auto",
            }}>
                <OptionSelector options={[
                    new Option("최신 순", true,  () => console.log("'최신 순' 선택 됨")),
                    new Option("조회 순", false, () => console.log("'조회 순' 선택 됨")),
                ]} />
            </div>
        </div>
    )
}

/**
 * 클라이언트가 서버에게 요청하여 포스트 정보의 응답을 기다리고 있을 경우,
 * 사용자에게 이를 시각적으로 표시하기 위해 사용됩니다.
 * 
 * @type {React.FC<{onVisible: VoidFunction}>}
 */
const PostPlaceholder = ({onVisible}) => {
    const height = useRef(NumberUtil.random(150, 300)).current;
    const width1 = useRef(NumberUtil.random(30, 80)).current;
    const width2 = useRef(NumberUtil.random(50, 100)).current;

    return (
        <Listener.Intersection callback={onVisible}>
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
        </Listener.Intersection>
    )
}

/**
 * @type {React.FC}
 * @param {{post: Post}}
 */
const PostItem = ({post}) => {
    return (
        <div className="post_item" key={post.postId}>
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
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectPostById, updatePost, deletePost } from "./postsSlice";
import { useParams, useNavigate } from "react-router-dom";

import { selectAllUsers } from "../users/usersSlice";

const EditPostForm = () => {
    const {postId} = useParams();
    const navigate = useNavigate();

    const post = useSelector((state) =>  selectPostById(state, Number(postId)));
    const users = useSelector(selectAllUsers);

    const [title, setTitle] = useState(post?.title);
    const [content, setContent] = useState(post?.body);
    const [userId, setUserId] = useState(post?.userId);
    const [requestStatus, setRequestStatus] = useState("idle");

    const dispatch = useDispatch();

    if(!post) {
        return (
            <section>
                <h2>Post not found!</h2>
            </section>
        )
    }

    const onTitleChange = e =>setTitle(e.target.value);
    const onContentChange = e => setContent(e.target.value);
    const onAuthorChange = e =>setUserId(Number(e.target.value));

    const canSave = [title, content, userId].every(Boolean) && requestStatus === "idle";

    const onSavePostClicked = () => {
        if(canSave){
            try{
                setRequestStatus("pending");
                dispatch(updatePost({id: postId, title, body: content, userId, reactions: post.reactions})).unwrap();  

                setTitle("");
                setContent("");
                setUserId("");
                navigate(`/post/${postId}`);
           } catch(err){
                console.error("Failed to save the post", err);
           } finally{
                setRequestStatus("idle");
           }
        }
    }
    
    const userOptions = users.map(user=>(
        <option 
           key={user.id}
           value={user.id}
           >{user.name}</option>
    ))

    const onDeletePostClicked = () => {
        try {
            setRequestStatus("pending");
            dispatch(deletePost({id: post.id})).unwrap();

            setTitle("")
            setContent("");
            setUserId("");
            navigate("/")
        }catch (err) {
            console.log("Failed to fetch the post", err);
        }finally {
            setRequestStatus("idle");
        }
    }

    return (
        <section>
            <h2>Edit Post</h2>
            <form>
                <label htmlFor="postTitle">Post Title:</label>
                <input
                  type="text"
                  id="postTitle"
                  name="postTitle"
                  value={title}
                  onChange={onTitleChange}/>
                   <label htmlFor="postAuthor">Author:</label>
            <select id="postAuthor" defaultValue={userId} onChange={onAuthorChange}>
                <option value=""></option>
                {userOptions}
            </select>
                 <label htmlFor="postContent">Content:</label>
            <textarea
                id="postContent"
                name="postContent"
                value={content}
                onChange={onContentChange}
            />
            <button
                type="button"
                onClick={onSavePostClicked}
                disabled={!canSave}
            >Save Post</button>
            <button className="deleteButton"
                type="button"
                onClick={onDeletePostClicked}
            >
                Delete</button>
            </form>
        </section>
    )

}

export default EditPostForm
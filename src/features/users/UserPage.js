import { useSelector } from "react-redux";
import { selectUsersById } from "./usersSlice";
import { selectPostsByUser } from "../posts/postsSlice";
import { Link, useParams } from "react-router-dom";

const UserPage = () => {
    const { userId } = useParams();
   
    const user = useSelector(state => selectUsersById(state, Number(userId)));
    
    const postsForUsers = useSelector(state => selectPostsByUser(state, Number(userId)));

    const postTitle = postsForUsers.map(post =>(
        <li key={post.id}>
            <Link to={`/post/${post.id}`}>{post.title}</Link>
        </li>
    ))

    return (
        <section>
       
            <h2>{user?.name}</h2>

            <ol>{postTitle}</ol>
           
        </section>
    )
}
export default UserPage
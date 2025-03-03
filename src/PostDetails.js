import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function PostDetails({ posts }) {
    const { id } = useParams(); // Obtiene el ID de la URL
    const [post, setPost] = useState(null);
    const [author, setAuthor] = useState(null);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        console.log('Post ID:', id);
        const postFound = posts.find(p => p.id === parseInt(id)); // Busca el post en el array una publicacion 
        if (postFound) {
            
            setPost(postFound);
           
            const fetchAdditionalData = async () => {
                const authorResponse = await fetch(`https://jsonplaceholder.typicode.com/users/${postFound.userId}`);
                const authorData = await authorResponse.json();
                setAuthor(authorData);

                const commentsResponse = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${id}`);
                const commentsData = await commentsResponse.json();
                setComments(commentsData);
            };

            fetchAdditionalData();
        }
    }, [id, posts]);

    return (
        <div>
            {post && author ? (
                <>
                <h2>{post.title}</h2>
                    <p>{post.body}</p>
                    <h3>Autor: {author.name}</h3>
                    <h4>Comentarios:</h4>
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th>Usario</th>
                            <th>Comentario</th>
                        </tr>
                        </thead>
                        <tbody>
                        {comments.map(comment => (
                            <tr key={comment.id}>
                            <td>{comment.id}</td>
                            <td>{comment.body}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <p>Cargando detalles del post...</p>
            )}
             {/* Enlace para volver a la página principal */}
      <Link className="link" to="/">REGRESAR</Link>
        </div>
    );
}

export default PostDetails;
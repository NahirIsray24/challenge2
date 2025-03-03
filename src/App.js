import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import PostDetails from './PostDetails'; 
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [newPost, setNewPost] = useState({ title: '', body: '' });
  const [editPost, setEditPost] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const data = await response.json();
        setPosts(data); 
      } catch (error) {
        console.error('Error al obtener las publicaciones:', error);
      }
    };

    fetchPosts();
  }, []);

  const filtrarPosts = posts.filter(post =>
    post.title.toLowerCase().includes(busqueda.toLowerCase())
  );

  const agregarPost = async () => {
    if (!newPost.title.trim() || !newPost.body.trim()) {
      alert('El título y contenido no pueden estar vacíos.');
      return;
    }
    const newId = posts.length > 0 ? Math.max(...posts.map(post => post.id)) + 1 : 1;
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newPost.title,
          body: newPost.body
        }),
      });
      const data = await response.json();
      data.id = newId;
      setPosts([data, ...posts]);
      setNewPost({ title: '', body: '' });
    } catch (error) {
      console.error('Error al agregar la publicación:', error);
    }
  };

  const eliminarPost = async (id) => {
    try {
      await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        method: 'DELETE',
      });
      setPosts(posts.filter(post => post.id !== id));
    } catch (error) {
      console.error('Error al eliminar la publicación:', error);
    }
  };

  const handleEditPost = (post) => {
    setEditPost(post);
  };

  const actualizarPost = async () => {
    if (!editPost.title.trim() || !editPost.body.trim()) {
      alert('El título y el contenido no pueden estar vacíos.');
      return;
    }
    try {
      await fetch(`https://jsonplaceholder.typicode.com/posts/${editPost.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editPost),
      });
      setPosts(posts.map(post => post.id === editPost.id ? { ...post, ...editPost } : post));
      setEditPost(null);
    } catch (error) {
      console.error('Error al editar la publicación:', error);
    }
  };

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div>
        <Routes>
          <Route path="/" element={
            <>
              <header className="bg-light p-4">
                <div className="container">
                  <h1 className="mb-4">Lista de Publicaciones</h1>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar por título..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Título"
                        value={newPost.title}
                        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-12">
                      <textarea
                        className="form-control"
                        placeholder="Contenido"
                        value={newPost.body}
                        onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <button onClick={agregarPost} className="btn btn-primary">Agregar Post</button>
                  </div>
                </div>
              </header>
              {filtrarPosts.length === 0 ? (
                <p>No hay publicaciones disponibles.</p>
              ) : (
                <table className="table table-secondary table-bordered">
                  <thead>
                    <tr>
                      <th>Título</th>
                      <th>Contenido</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtrarPosts.map(post => (
                      <tr key={post.id}>
                        <td>
                          {editPost && editPost.id === post.id ? (
                            <input
                              type="text"
                              className="form-control"
                              value={editPost.title}
                              onChange={(e) => setEditPost({ ...editPost, title: e.target.value })}
                            />
                          ) : (
                            <Link to={`/posts/${post.id}`} className="text-decoration-none">
                              {post.title}
                            </Link>
                          )}
                        </td>
                        <td>
                          {editPost && editPost.id === post.id ? (
                            <textarea
                              className="form-control"
                              value={editPost.body}
                              onChange={(e) => setEditPost({ ...editPost, body: e.target.value })}
                            />
                          ) : (post.body.length > 100 ? post.body.slice(0, 100) + '...' : post.body
                          )}
                        </td>
                        <td>
                          <button onClick={() => eliminarPost(post.id)} className="btn btn-danger">Eliminar</button>
                          <button onClick={() => handleEditPost(post)} className="btn btn-warning">Editar</button>
                          {editPost && editPost.id === post.id && (
                            <button onClick={actualizarPost} className="btn btn-success">Actualizar</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          } />
          <Route path="/posts/:id" element={<PostDetails posts={posts} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
import React, { Component } from "react";
import { NotificationManager } from "react-notifications";
import api from "../services/api";
import io from "socket.io-client";
import "./Feed.css";
import more from "../assets/more.svg";
import heart from "../assets/heart.svg";
import send from "../assets/send.svg";
import brokenHeart from "../assets/broken-heart.svg";
import comment from "../assets/comment.svg";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as FeedActions from "../store/Actions";

class Feed extends Component {
  runSafely = func => {
    try {
      this.props.showLoading(true);
      func();
    } catch (e) {
      NotificationManager.error(
        "Internal Server Error",
        "Entre em contato com o Administrador do sistema",
        3000
      );
    } finally {
      this.props.showLoading(false);
    }
  };

  componentDidMount() {
    this.runSafely(async () => {
      this.registerToSocket();

      const response = await api.get("posts");

      this.props.loadFeed(response.data);
    });
  }

  registerToSocket = () => {
    const socket = io(process.env.REACT_APP_API_URL);

    socket.on("post", newPost =>
      this.runSafely(() => this.props.addPost(newPost))
    );

    socket.on("delete", id => this.runSafely(() => this.props.removePost(id)));

    socket.on("like", likedPost =>
      this.runSafely(() => this.props.updatePost(likedPost))
    );

    socket.on("comment", commentedPost =>
      this.runSafely(() => this.props.updatePost(commentedPost))
    );
  };

  handleLike = async id =>
    this.runSafely(async () => await api.post(`/posts/${id}/like`));

  handleDislike = async id =>
    this.runSafely(async () => await api.post(`/posts/${id}/dislike`));

  handleComments = post => {
    this.runSafely(() => {
      post.showComments = !post.showComments;
      this.props.updatePost(post);
    });
  };

  handleCommentChange = (e, post) => {
    post.newComment = e.target.value;
  };

  handleCommentSubmit = async post =>
    this.runSafely(async () => {
      await api.post(`posts/${post._id}/comment`, { comment: post.newComment });

      let component = this.refs[`comment${post._id}`];

      if (component) component.value = "";
    });

  render() {
    return (
      <section id="post-list">
        {this.props.feed.map(post => (
          <article key={post._id}>
            <header>
              <div className="user-info">
                <span>{post.author}</span>
                <span className="place">{post.place}</span>
              </div>

              <img src={more} alt="Mais" />
            </header>

            <img src={post.imageUrl} alt="" />

            <footer>
              <div className="actions">
                <div>
                  <span>{post.likes}</span>
                  <button
                    type="button"
                    onClick={() => this.handleLike(post._id)}
                  >
                    <img src={heart} alt="" />
                  </button>
                </div>
                <div>
                  <span>{post.comments ? post.comments.length : 0}</span>
                  <button
                    type="button"
                    onClick={() => {
                      this.handleComments(post);
                    }}
                  >
                    <img src={comment} alt="" />
                  </button>
                </div>
                <div>
                  <span>{post.dislikes || 0}</span>
                  <button
                    type="button"
                    onClick={() => this.handleDislike(post._id)}
                  >
                    <img src={brokenHeart} alt="" />
                  </button>
                </div>
              </div>

              <p>
                {post.description}
                <span>{post.hashtags}</span>
              </p>

              {post.showComments ? (
                <div className="block-comments">
                  <div className="comments">
                    {post.comments.map(comment => (
                      <p key={comment._id}>
                        <span className="commentDate">
                          {new Date(comment.when).toLocaleString()}
                        </span>
                        <span className="commentText">{comment.text}</span>
                      </p>
                    ))}
                  </div>
                  <div className="comment">
                    <input
                      type="text"
                      ref={`comment${post._id}`}
                      placeholder="Digite aqui..."
                      onChange={e => {
                        this.handleCommentChange(e, post);
                      }}
                    />
                    <button
                      type="button"
                      disabled={this.props.loading}
                      onClick={() => {
                        this.handleCommentSubmit(post);
                      }}
                    >
                      <img src={send} alt="Enviar" />
                    </button>
                  </div>
                </div>
              ) : (
                ""
              )}
            </footer>
          </article>
        ))}
      </section>
    );
  }
}

const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = dispatch =>
  bindActionCreators(FeedActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Feed);

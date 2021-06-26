import React, { Component } from "react";
import http from "./services/httpService";
import "./App.css";
import config from "./config.json";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
// the above one is the css libary of  the tostify container 
// we must add it 

class App extends Component {
  state = {
    posts: [],
  };

  async componentDidMount() {
    const { data: posts } = await http.get(config.apiEndpoint);
    this.setState({ posts });
  }
  // config.endpoint were the endpoint of the api is is stored
  // obj is the object which pass to the server for the store
  handleAdd = async () => {
    const obj = {
      title: "welcome to karchi in pakistan",
      body: "this is my world",
    };
    const { data: post } = await http.post(config.apiEndpoint, obj);
    console.log(post); // the data is rename as post this is why here we are printing the pst in place of the data
    const posts = [post, ...this.state.posts];
    this.setState({ posts });
  };
  // for updating the dat we ahave two method one is put and another is patch
  //put is use tyo update the hole oject were  patch is use for update only little part of that object
  handleUpdate = async (post) => {
    post.title = "UPDATED";
    await http.put(`${config.apiEndpoint}/${post.id}`, post);
    const posts = [...this.state.posts];
    const index = posts.indexOf(post);
    posts[index] = { ...post };
    this.setState({ posts });
  };
  // while deleying or update or add something we aget some delay due to wea re calling the server first
  // and than we are update or deleting or add something this is take some time for a while
  // this is why we are perform crud operation first than we ard calling then server
  // this is seem to be our application work faster
  // for this implementation wea re are moving the our server request in the last and make crud operation in the fist position

  handleDelete = async (post) => {
    const originalPost = this.state.posts; //mking the duplecate copy of the post for update later if any erreor occure due to server failier
    const posts = this.state.posts.filter((p) => p.id !== post.id);
    this.setState({ posts });
    // if  any error is occure in the requesting of the server the all the process we are done will we  revert
    // back as same as the first and noting going to be change
    // for this we are wrap our server to the try catch block to catch the error
    try {
      await http.delete('s'+config.apiEndpoint + "/" + post.id); // this is for making ouer crud operation fast
       throw new Error("Failed something");
    } catch (ex) {
      // ex having two object first on is the ex.request ,ex.responce
      // to get know weather it's having expected or unexpected we are write code like this
      if (ex.response && ex.response.status === 404) {
        alert("Post with this id is already deleted");
      } else {
        console.log("Unexpected error is occure", ex);
        alert("Unexpected error is occure");
      }
      //Expected vs Unexpected Error
      //Expected(404:oject is not found ,404:bad request 403:forbidden)-These are client error which might be expected
      //Unexpected(network error,srever down,db down,bug)-These are unexpected error
      //-log them for revie them later
      // diaplay a user friendly error  so other can understand it

      this.setState({ posts: originalPost });
    }
  };

  render() {
    return (
      <React.Fragment>
        <ToastContainer />
        <button className="btn btn-primary" onClick={this.handleAdd}>
          Add
        </button>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {this.state.posts.map((post) => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => this.handleUpdate(post)}
                  >
                    Update
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => this.handleDelete(post)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

export default App;

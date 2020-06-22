<template>
    <!-- post modal -->

    <div id="dashboard">
      <!-- comment modal -->
      <transition name="fade">
          <div v-if="showCommentModal" class="c-modal">
              <div class="c-container">
                  <a @click="closeCommentModal">X</a>
                  <p>add a comment</p>
                  <form @submit.prevent>
                      <textarea v-model.trim="comment.content"></textarea>
                      <button @click="addComment" :disabled="comment.content == ''" class="button">add comment</button>
                  </form>
              </div>
          </div>
      </transition>
   <transition name="fade">
    <div v-if="showPostModal" class="p-modal">
        <div class="p-container">
            <a @click="closePostModal" class="close">X</a>
            <div class="post">
                <h5>{{ fullPost.userName }}</h5>
                <span>{{ fullPost.createdOn | formatDate }}</span>
                <p>{{ fullPost.content }}</p>
                    
                      <span v-for="(post, index) in posts" :key="index">
                      <ul v-if="onePostId == post.id">
                          <li><a @click="openCommentModal(post)">comments {{ post.comments || '' }}</a></li>
                          <li><a @click="likePost(post.id, post.likes)">likes {{ post.likes || ''  }}</a></li>
                      </ul>
                      </span>
                  
            </div>
            <div v-show="postComments.length" class="comments">
                <div v-for="(comment, index) in postComments" :key="index" class="comment">
                    <p>{{ comment.userName }}</p>
                    <span>{{ comment.createdOn | formatDate }}</span>
                    <p>{{ comment.content }}</p>
                </div>
            </div>
        </div>
    </div>
</transition>
        <section v-if="!showPostModal" >
            <div class="col1">
                <div class="profile">
                   <h3>Settings</h3>
            <p>Update your profile</p>

            <transition name="fade">
                <p v-if="showSuccess" class="success">profile updated</p>
            </transition>

            <form @submit.prevent>
                <label for="name">Name</label>
                <input v-model.trim="name" type="text" :placeholder="userProfile.name" id="name" />

                <label for="title">Job Title</label>
                <input v-model.trim="title" type="text" :placeholder="userProfile.title" id="title" />

                <button @click="updateProfile" class="button">Update Profile</button>
            </form>
              </div>
 </div>
            <div class="col2">
                <h2>Your Peoms</h2>
                <div v-if="posts.length">
      <div v-for="(post, index) in posts" :key="index" class="post">
        <span v-if="post.userId == currentUser.uid">
          <h5>{{ post.userName }}</h5>
          <span>{{ post.createdOn | formatDate }}</span>
          <p>{{ post.content | trimLength }}</p>
          <ul>
              <li><a @click="openCommentModal(post)">comments {{ post.comments || '' }}</a></li>
              <li><a @click="likePost(post.id, post.likes)">likes {{ post.likes || ''  }}</a></li>
              <li><a @click="viewPost(post)">view full post</a></li>
          </ul>
        </span>
      </div>
  </div>
  <div v-else>
      <p class="no-results">You have no Peoms yet</p>
  </div>
            </div>
        </section>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import moment from 'moment';

const fb = require('../firebaseConfig.js');

export default {
    data() {
    return {
      post: {
        content: '',
      },
      comment: {
            postId: '',
            userId: '',
            content: '',
        },
        name: '',
        title: '',
        showCommentModal: false,
        showPostModal: false,
        showSuccess: false,
        fullPost: {},
        postComments: [],
        onePostId: null,
    };
  },
    computed: {
    ...mapState(['userProfile', 'currentUser', 'posts', 'hiddenPosts']),
  },
    methods: {
        openCommentModal(post) {
         this.comment.postId = post.id
          this.comment.userId = post.userId
          this.comment.postComments = post.comments
          this.showCommentModal = true
          },
     closeCommentModal() {
        this.comment.postId = ''
        this.comment.userId = ''
        this.comment.content = ''
        this.showCommentModal = false
         },
     addComment() {
        let postId = this.comment.postId
        let postComments = this.comment.postComments
        
        fb.commentsCollection.add({
            createdOn: new Date(),
            content: this.comment.content,
            postId: postId,
            userId: this.currentUser.uid,
            userName: this.userProfile.name
        }).then(doc => {
            fb.postsCollection.doc(postId).update({
                comments: postComments + 1
            }).then(() => {
                this.closeCommentModal()
                if(this.showPostModal){
                 this.viewPost(this.fullPost)
                }
            })
        }).catch(err => {
            console.log(err)
        })
     },
     likePost(postId, postLikes) {
        let docId = `${this.currentUser.uid}_${postId}`
      fb.likesCollection.doc(docId).get().then(doc => {
        if (doc.exists) {
          fb.likesCollection.doc(docId).delete()
          .then(() => {
            // update post likes
            fb.postsCollection.doc(postId).update({
                likes: postLikes - 1
            })
        })
            return
        }

        fb.likesCollection.doc(docId).set({
            postId: postId,
            userId: this.currentUser.uid
        }).then(() => {
            // update post likes
            fb.postsCollection.doc(postId).update({
                likes: postLikes + 1
            })
        })
     }).catch(err => {
                console.log(err)
            })
        },
     viewPost(post) {
        fb.commentsCollection.where('postId', '==', post.id).get().then(docs => {
            let commentsArray = []

            docs.forEach(doc => {
                let comment = doc.data()
                comment.id = doc.id
                commentsArray.push(comment)
            })

            this.postComments = commentsArray
            this.fullPost = post
            this.showPostModal = true
            this.onePostId = post.id
        }).catch(err => {
            console.log(err)
        })
     },
     closePostModal() {
        this.postComments = []
        this.showPostModal = false
        this.onePostId = null
     },

     updateProfile() {
            this.$store.dispatch('updateProfile', {
                name: this.name !== '' ? this.name : this.userProfile.name,
                title: this.title !== '' ? this.title : this.userProfile.title
            })

            this.name = ''
            this.title = ''

            this.showSuccess = true

            setTimeout(() => {
                this.showSuccess = false
            }, 2000)
        }
        
    },
   filters: {
    formatDate(val) {
        if (!val) { return '-' }
        let date = val.toDate()
        return moment(date).fromNow()
    },
    trimLength(val) {
        if (val.length < 200) {
            return val
        }
        return `${val.substring(0, 200)}...`
    }
 }
}
</script>



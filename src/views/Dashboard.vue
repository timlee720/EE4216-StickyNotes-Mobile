
<template id="Dashboard">
  <div>
 
    <a class="addTopicBtn" v-if = "showBtn" @click="addNotes()"
      ><b-icon-plus class="icon rounded-circle" variant="light"
    /></a>

    <a class="fixNoteOrderBtn" v-if = "showBtn" @click="noteCardDragable = !noteCardDragable; saveNotes()" 
      >
      <b-icon-unlock class="icon rounded-lockOrUnlock" variant="light" v-if="noteCardDragable"/>
      <b-icon-lock  class="icon rounded-lockOrUnlock" variant="light" v-else/>
    </a>
   

    <b-overlay :show="loading" class="overlay">
      <b-card-group columns >
        <draggable class="noteCards" v-model="notes"  v-bind="dragOptions" :move="onMove"  @start="isDragging=true" @end="end">
          <transition-group type="transition" name="flip-noteCard"  >
              <div class="noteCard" v-for="note in notes" :key="note.orderIndex" >
                <b-card :style="{ backgroundColor: note.color }" >
                  
                  <b-button variant="white" class="delbtn p-1" v-on:click="del(note.orderIndex)">
                    <b-icon icon="trash-fill" aria-hidden="true"></b-icon>
                  </b-button>
                  
                  <p class="textarea" :style="{ fontSize: note.fontSize }">
                    {{ note.content }}
                  </p>

                  <b-button
                    variant="white"
                    class="editbtn p-1"
                    v-on:click="editNotes(note.orderIndex)"
                  >
                    <b-icon-pencil />
                  </b-button>

                  <b-button 
                    variant="white"
                    class="fixbtn p-1"
                    v-on:click="note.fix = !note.fix"
                  >
                    <b-icon-lock v-if="note.fix" />
                    <b-icon-unlock v-else />
                  </b-button>

                </b-card>
              </div>
          </transition-group>
        </draggable>
      </b-card-group>
    </b-overlay>
    

    <b-overlay :show="addLoading">
      <b-modal v-model="addModal.show" centered id="addModal" title="Add Notes">
      <select
        class="custom-select custom-select-sm mb-2"
        style="width:auto; float: right; position: relative;"
        v-model="addModal.fontSize"
      >
        <option value="16px" selected="selected">16px</option>
        <option value="20px">20px</option>
        <option value="24px">24px</option>
      </select>
      <input
        class="mr-2 mb-1"
        type="color"
        value="#FFFFFF"
        v-model="addModal.color"
        style="float: left;"
      />
      <b-form-textarea
        id="textarea"
        v-model="addModal.content"
        placeholder="Enter something..."
        rows=25%
        max-rows=80%
      >
      </b-form-textarea>

      <template v-slot:modal-footer>
        <b-button size="sm" @click="hideAddModel()">Cancel</b-button>
        <b-button size="sm" variant="primary" @click="handleAdd()"
          >Add Note</b-button
        >
      </template>
      </b-modal>
    </b-overlay>

     <b-overlay :show="editLoading">
      <b-modal v-model="editModal.show" centered  id="editModal" title="Edit Notes" >
        <select
          class="custom-select custom-select-sm mb-2"
          style="width:auto; float: right; position: relative;"
          v-model="editModal.fontSize"
        >
          <option value="16px" selected="selected">16px</option>
          <option value="20px">20px</option>
          <option value="24px">24px</option>
        </select>
        <input
          class="mr-2 mb-1"
          type="color"
          v-model="editModal.color"
          style="float: left; position: relative;"
        />
        <b-form-textarea 
          id="textarea"
          v-model="editModal.content"
          placeholder="Enter something..."
          rows=25%
          max-rows=80%
        ></b-form-textarea>

        <template v-slot:modal-footer>
          <b-button size="sm" @click="hideEditModel()">Cancel</b-button>
          <b-button size="sm" variant="primary" @click="handleEdit()"
            >Edit Note</b-button
          >
        </template>
      </b-modal>
    </b-overlay>
  </div>
</template>



<script>
// import Note from "./Note";
import draggable from "vuedraggable";
import axios from "axios";
export default {
  components: {

    // VueDraggableResizable,
    // Note,
    draggable
    
  },
  computed: {
    dragOptions() {
      return {
        animation: 500,
        group: "description",
        disabled: !this.noteCardDragable,
        ghostClass: "ghost"
      };
    },

    notesNum() {
      return this.notes.length;
    }
    
  },
  data: () => ({
    
    notes: [
      // {
      //   show: false,
      //   content: "based",
      //   colorValue:"#FFFFFF",
      //   fontSize: "16px",
      //   fixed: false,
      //   index: 0
      // },
      // {
      //   show: false,
      //   content: "based1",
      //   colorValue:"#FFFFFF",
      //   fontSize: "16px",
      //    fixed: false,
      //   index: 1
      // },
      // {
      //   show: false,
      //   content: "based3",
      //   colorValue:"#FFFFFF",
      //   fontSize: "16px",
      //   fixed: false,
      //   index: 2
      // },
    ],
    addModal: {
      show: false,
      content: null,
      color: "#FFFFFF",
      fontSize: "16px",
    },
    editModal: {
      show: false,
      content: null,
      color: "#FFFFFF",
      fontSize: null,
      orderIndex: null
    },
    showBtn: true,
    // For Drag
    noteCardDragable: false,
    isDragging: false,
    delayedDragging: false,
    // For loading 
    loading: false,
    addLoading: false,
    editLoading: false,
  }),
  created() {
    this.getData();
    
  },
  mounted() {
    window.addEventListener("scroll", this.onScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.onScroll);
  },

  methods: {
// API related 
    async getData() {
      this.loading = true;
      var i = 0 ;
      await axios
        .get("http://54.161.118.5:8080/api/memo/" + this.$store.state.userID)
        .then(res => {
          res.data.forEach(response => {
            const {
              memoID,
              userID,
              content,
              color,
              font,
              height,
              width,
              top,
              left,
              zIndex,
              orderIndex,
              fix
            } = response;
            const note = {
              memoID: memoID,
              userID: userID,
              content: content,
              color: color,
              fontSize: font,
              positionHeight: height,
              positionWidth: width,
              positionTop: top,
              positionLeft: left,
              zIndex: zIndex,
              orderIndex: orderIndex != i ? i : orderIndex,
              fix: fix
            };
            i++;
            this.notes.push(note);
          });
          console.log(this.notes);
          this.loading = false;
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
        });
    },
// Note Operation
    async del(orderIndex) {
      // this.loading = true;
      console.log(orderIndex);
      
      await axios
        .delete("http://54.161.118.5:8080/api/memo/" + this.notes[orderIndex].memoID)
        .then(res => {
          if (res) {
            console.log(this.notes);
          }
          //this.loading = false;
        })
        .catch(err => {
          console.log(err);
          //this.loading = false;
        });
      this.notes.splice(orderIndex, 1);
      var i =0;
      
      this.notes.forEach(element => {
        
        element.orderIndex = i;
        i++;
        console.log(element.content);
        console.log(element.orderIndex);
      });

      // if (this.notes.length > 0){
      //   this.saveNotes();
      // }


    },
    // del(index) {
     
    //   console.log(index);
    //   if (index > -1) {
    //     this.notes.splice(index, 1);
    //     //this.notes.splice(i, 0, object) // reinsert it at new location
    //     var i =0;
    //     this.notes.forEach(element => {
    //     // if (element.index === index){
    //     //   this.notes.splice(index, 1);
    //     // }
    //     element.index = i;
    //     i++;

    //     console.log(element.content);
    //     console.log(element.index);
    //     });
    //   }
    // },

    //=====================
    //     async del(orderIndex) {
    //   this.loading = true;
    //   await axios
    //     .delete("http://54.161.118.5:8080/api/memo/" + this.notes[orderIndex].memoID)
    //     .then(res => {
    //       if (res) {
    //         console.log(this.notes);
    //       }
    //       this.loading = false;
    //     })
    //     .catch(err => {
    //       console.log(err);
    //       this.loading = false;
    //     });
    //   this.notes = [];
    //   await this.getData();

    //   console.log(orderIndex);
      
    //     //this.notes.splice(i, 0, object) // reinsert it at new location
    //   var i =0;
    //   this.notes.forEach(element => {
    //     // if (element.orderIndex === orderIndex){
    //     //   this.notes.splice(orderIndex, 1);
    //     // }
    //     element.orderIndex = i;
    //     i++;

    //     console.log(element.content);
    //     console.log(element.orderIndex);
    //   });
    //   //this.saveNotes();

    // },
    //==========
    async saveNotes() {
      this.loading = true;
      console.log(this.notes);
      await axios
        .put("http://54.161.118.5:8080/api/memo", this.notes)
        .then(res => {
          console.log(res);
          this.loading = false;
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
        });
      // localStorage.notes = JSON.stringify(this.notes);
    },

    async handleAdd() {
      this.addLoading = true;
      const defaultPosition = {
        height: 240,
        width: 240,
        top: 0,
        left: 0,
        zIndex: 1
      };
      const memoDetails = {
        memoID: 0,
        content: this.addModal.content,
        userID: this.$store.state.userID, 
        color: this.addModal.color,
        fontSize: this.addModal.fontSize,
        positionHeight: defaultPosition.height.toString(),
        positionWidth: defaultPosition.width.toString(),
        positionTop: (defaultPosition.top + (defaultPosition.height * (this.notes.length + 2))/10).toString(),
        positionLeft: (defaultPosition.left + (defaultPosition.width * (this.notes.length + 2))/10).toString(),
        zIndex: defaultPosition.zIndex.toString(),
        orderIndex: this.notes.length,
        fix: false,
      };
      await axios
        .post("http://54.161.118.5:8080/api/memo", memoDetails)
        .then(res => {
          console.log(res.data);
          const {
            memoID,
            userID,
            content,
            color,
            font,
            height,
            width,
            top,
            left,
            zIndex,
            orderIndex,
            fix
          } = res.data;
          console.log(memoID);
          const note = {
            memoID: memoID,
            userID: userID,
            content: content,
            color: color,
            fontSize: font,
            positionHeight: height.toString(),
            positionWidth: width.toString(),
            positionTop: top.toString(),
            positionLeft: left.toString(),
            zIndex: zIndex.toString(),
            orderIndex: orderIndex,
            fix: fix
          };
          console.log(note);
          this.notes.push(note);
          console.log(this.notes);
          this.addLoading = false;
          this.addModal.show = false;
        })
        .catch(err => {
          console.log(err);
          this.addLoading = false;
        });
      // this.notes.push(memoDetails);
      this.addModal.show = false;
      this.addModal.content = null;
      this.addModal.color = "#FFFFFF";
      this.addModal.fontSize = "16px";
    },

    //===============
    addNotes() {
      this.addModal.show = true;
    },
    editNotes(orderIndex) {
      
      this.editModal.show = true;
      this.editModal.content = this.notes[orderIndex].content;
      this.editModal.color = this.notes[orderIndex].color;
      this.editModal.fontSize = this.notes[orderIndex].fontSize;
      this.editModal.orderIndex = orderIndex;
      
      
    },
    hideAddModel() {
      this.addModal.show = false;
    },
    hideEditModel() {
      this.editModal.show = false;
      this.editModal.content = null;
      this.editModal.color = null;
      this.editModal.fontSize = null;
    },
    async handleEdit() {
      this.notes[this.editModal.orderIndex].content = this.editModal.content;
      this.notes[this.editModal.orderIndex].color = this.editModal.color;
      this.notes[this.editModal.orderIndex].fontSize = this.editModal.fontSize;
      this.saveNotes();
      this.hideEditModel();
    },
    //
    reorderNotes(){
      var i =0;
      
      this.notes.forEach(element => {
      element.orderIndex = i;
      i++;
      console.log(element.content);
      console.log(element.orderIndex);
      });

    },
    orderList() {
      this.notes = this.notes.sort((one, two) => {
        return one.orderIndex - two.orderIndex;
      });
    },
    onMove({ relatedContext, draggedContext }) {
      const relatedElement = relatedContext.element;
      const draggedElement = draggedContext.element;
      return (
        (!relatedElement || !relatedElement.fix) && !draggedElement.fix
      );
    },
    end(evt) {
      console.log(evt);
      
      this.isDragging = false;
      var i =0;
      this.notes.forEach(element => {
        element.orderIndex = i;
        i++;
        console.log(element.content);
        console.log(element.orderIndex);
      });
      this.loading = true;
      console.log(this.notes);
      axios
        .put("http://54.161.118.5:8080/api/memo", this.notes)
        .then(res => {
          console.log(res);
          this.loading = false;
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
        });

      //this.saveNotes();
    },

    onScroll(e) {
      //console.log({ top: this.windowTop != null &&  this.windowTop < e.target.documentElement.scrollTop});
      this.showBtn = !(this.windowTop != null &&  this.windowTop < e.target.documentElement.scrollTop);
      this.windowTop = e.target.documentElement.scrollTop;
      //console.log({ top: this.windowTop });
    }
  },

  watch: {
    isDragging(newValue) {
      if (newValue) {
        this.delayedDragging = true;
        return;
      }
      this.$nextTick(() => {
        this.delayedDragging = false;
      });
    }
  },
 
};


    
</script>

<style>

a.addTopicBtn {
  position: fixed;
  font-size: 40px;
  right: 10px;
  bottom: 10px;
  z-index: 500;
}
a.addTopicBtn .icon {
  background-color:  #8a7ace !important;
  cursor: pointer;
}

a.fixNoteOrderBtn {
  position: fixed;
  font-size: 40px;
  right: 70px;
  bottom: 10px;
  z-index: 500;
}

a.fixNoteOrderBtn .icon {
  background-color:  #8a7ace !important;
  cursor: pointer;
}



.notes {
  padding: 33px 33px 20px;
  position: relative;
  background-color: #fff;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.11);
  transition: all 1s;
  margin-bottom: 35px;
}

.editbtn {
  margin-right: 1px;
  float: right;
  z-index: 10;
}

.delbtn {
  margin-right: 1px;
  float: right;
  z-index: 10;
}

.overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 100;
}

.notes textarea,
.notes p {
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.69);
  margin-bottom: 28px;
  word-wrap: break-word;
  height: 85px;
  transition: all 1s ease-in-out;
  overflow: auto;
  line-height: 28px;
  
}


body {
  background-color: #e8e8e8;
  padding: 0px !important;
  overflow-x: hidden !important;
}

.noteCards {
  margin: 10 auto;
}
.noteCard {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  
}





/* .no-move {
  transition: noteCard-in  2s;
} */
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.-group {
  min-height: 20px;
}
.noteCard {
  cursor: move;
}
.noteCard i {
  cursor: pointer;
}

/* Edit modal */
.modal {
  padding: 0 !important; 
}

.modal .modal-dialog {
  width: 100%;
  max-width: none;
  height: 100%;
  margin: 0;
}
.modal .modal-content {
  height: 100%;
  border: 0;
  border-radius: 0;
}
.modal .modal-body {
  overflow-y: auto;
}

.modal-content textarea.form-control {
    max-width: 100%;
    max-height:  100%;
}


/* noteCard */
/* .noteCard {
  transition: all 1s;
} */

.noteCard-enter-active, .noteCard-leave-active {
  transition: all 1s;
}

.noteCard-leave-active {
  animation: noteCard-in 1s reverse;
}
@keyframes noteCard-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
/* flip-noteCard */
.flip-noteCard {
  display: inline;
  transition: all 2s;
  
}

.flip-noteCard-leave-active {
  transition: all 1s;
}

.flip-noteCard-enter, .flip-noteCard-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateX(100px);
}



@keyframes flip-noteCard-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}


</style>

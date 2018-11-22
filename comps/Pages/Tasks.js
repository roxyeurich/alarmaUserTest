import React from 'react';
import {Modal, StyleSheet, Text, View, Button, Alert, Link, Image, TouchableOpacity, TouchableHighlight, TextInput, ScrollView, Font} from 'react-native';

import {connect} from 'react-redux';
import {ChangePage, ChangeUserId} from '../../redux/actions';
import CheckBox from 'react-native-check-box'
import { Rating } from 'react-native-ratings';

import NavBar from './NavBar';
import AlertTask from './Alerts/AlertTask';


class Tasks extends React.Component {
  
  admin ="";
  timer = null;
  
    constructor(props) {
      super(props);
  }
  
    handleProfile=()=>{
    this.props.dispatch(ChangePage(4));
    
  }
    
    handleAlert=()=>{
    this.props.dispatch(ChangePage(5));
    
  }
  
// FETCH DATA FOR THE TASKS*************
  
  state={
    tasks:[],
    isChecked:[],
    userid:"",
    score:0,
    end_time:"",
    modalVisible: false,
      //change to false later
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }
  
  componentWillMount=()=>{
    this.handleTasks();
    this.timer = setInterval(()=>{
      this.handleTasks();
    },5000);
  }
  
  componentWillUnmount=()=>{
    clearInterval(this.timer);
  }
      
 
    handleUncheck=async (id)=>{
      var fd= new FormData();
      
      fd.append("task_id", id);
      
      var resp=await fetch("https://alarmaproj2.herokuapp.com/uncheck.php", {
        method:"POST",
        body:fd
      });
    
      //var json=await resp.json();
      
      this.handleTasks()
    }
    
    
   handleTasks=async ()=>{
    var fd= new FormData();
     //change id to group_id
      fd.append("group_id", this.props.group_id);
      
    var resp=await fetch("https://alarmaproj2.herokuapp.com/getTask.php", {
      method:"POST",
      body:fd
    });
    
      var json=await resp.json();
      console.log(json);
      if (json.length > 0) {
        //json.id 
        //alert ("Task Created");
        this.setState({
          tasks:json
      
        });
      } else {
        
      }
  }
   
  handleScore=async (id)=>{
        var fd= new FormData();
        //change group_id to id
        fd.append("user_id", this.props.userid);
        fd.append("task_id", id);
      
        var resp=await fetch("https://alarmaproj2.herokuapp.com/score.php", {
          method:"POST",
          body:fd
        });
    
        var json=await resp.json();
        console.log(json);
        if (json === true) {
        //json.id 
        //alert ("Task Created");
          this.setState({
            score:json

          });
        } else {

        }
    }
  
  handleVerify=async (id)=>{
    var fd= new FormData();
        fd.append("task_id", id);
      
        var resp=await fetch("https://alarmaproj2.herokuapp.com/taskDone.php", {
          method:"POST",
          body:fd
        });
    
        var json=await resp.json();
        console.log(json);
        if (json === true) {
            
        } else {

        }
  }
   
   
   
renderTasks=(tasks)=> {

   var tasks = tasks || [];
  
   return tasks.map((task,index) => 
     <View style={styles.taskCont} key={task.task_id}>
                        
        <CheckBox
          style={{flex: 1, padding: 15, top:0,}}
          onClick={()=>{
           var checkarr = this.state.isChecked;
           if(checkarr[index]){
             this.handleUncheck(task.task_id);
             //checkarr[index] = !checkarr[index];
           } else {
             checkarr[index] = true;
             this.handleScore(task.task_id);
             

           }
            this.setState({
                isChecked:checkarr
            })
          }}
          isChecked={((this.state.isChecked[index] && this.state.isChecked[index] === true)) || (task.user_id !== null )}
          rightText={this.state.task_title}
      />
                        
    {/*Adding the AlertTask for the description*/}
                        
  

  <View style={styles.contTitle}>
    <Text style={styles.taskName}>{task.task_title}</Text>
  </View>
  
  <View style={styles.contDesc}>       
    <ScrollView>
      <Text style={{fontSize:13,}}>{task.end_time.split(" ")[0]}</Text>

      <Text style={styles.taskDesc}>    
          {task.task_description}
      </Text>
    </ScrollView>
  </View>

       
        
      <Text style={styles.starStyle}>
          <Rating
           type="star"
           ratingColor='#3498db'
           ratingBackgroundColor='#c8c7c8'
            ratingCount={5}
            startingValue={task.score}
            readonly= {true}
            imageSize={18}
            style={{ paddingVertical: 10, }}
          /> 
        </Text>
                         {(this.props.admin === 2) ?
            <TouchableOpacity style={styles.verify} 
                  onPress={this.handleVerify.bind(this,task.task_id)}>
                  <Text style={styles.verifyText}>Verify Task</Text>
            </TouchableOpacity> : null}
 
     </View>
                        
                    
   );
 }     
     
      render(){
     
     console.log(this.props.admin)
        return ( 
                    
      <View style={styles.container}>
             
        <View style={styles.containerTop}>
          <TouchableOpacity style={styles.touch} onPress={this.handleProfile}>
            <Image style={styles.backImg} source={require('../Content/icons/PNG/leftarrow.png')} />
          </TouchableOpacity>
          <Text style={styles.title}>Tasks</Text>
        </View>
        <View style={styles.middleContainer}>
          <ScrollView>
              {this.renderTasks(this.state.tasks)}
          </ScrollView>
        </View>
  </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    alignItems:'center',
  },
  
  containerTop: {
    marginTop:0,
    backgroundColor: '#49CBC6',
    top: 0,
    width:412,
    height:100,
  },
  
  touch: {
    width: 80,
    height: 100,
    zIndex: 10,
  }, 
  
  touchSort: {
    width: 80,
    height: 100,
    marginTop:10,
    zIndex: 10,
    right:45,
    top:110,
    position: "absolute",
    flexDirection: "row",
  },
  
  backImg: {
    marginLeft:40,
    marginTop: 40,
    width: 30,
    height: 30,
  },
   
sortImg: {
    marginLeft:20,
    width: 30,
    height: 40,
  },
  
  
title: {
    color: 'white',
    marginTop: -65,
    fontSize: 30,
    textAlign: 'center',
    fontFamily: 'Raleway-Regular',
  },
  
  
middleContainer: {
    marginTop:20,
    height:'70%',
  },
  
  
taskName: {
    fontSize: 16,
    marginTop: 18,
    fontWeight: 'bold',
    fontFamily: 'Raleway-Regular',
  },
  
textLabel: {
    color: 'black',
    fontSize: 20,
    textAlign: 'left',
    marginTop: 25,
    fontFamily: 'Raleway-Regular',
  },
  
contTitle: {
    width: 100,
    height: 60,
    position:'absolute',
    left:50,
    fontFamily: 'Raleway-Regular',
  },
  
 taskCont: {
    width: 300,
    height:70,
    borderWidth: 1,
    borderColor: '#49CBC6',
    borderRadius: 8,
    flexDirection: "row",
    position: "relative",
    top:20,
    left: 0,
    margin:10,
    marginBottom:50,

  },
    
starStyle: {
    position: "absolute",
    left: 15,
    bottom:-5,
  },
  
contDesc: {
    flex:1,
    width:145,
    position:'absolute',
    right:10,
    marginTop:10,
    borderColor:'grey',
    flexDirection:'column',
    
  },
    
taskDesc: {
    height:40,
    fontFamily: 'Raleway-Regular',
  },
  
verify: {
    padding: 5,
    position:'absolute',
    right: 5,
    bottom: -35,
    borderRadius: 7,
    backgroundColor: '#49CBC6',
    width:90,
    height:30,
    shadowColor: 'rgba(0,0,0, .9)', // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 2, // Android
  },
  
  verifyText: {
    fontSize: 14,
    color: 'white',
    alignSelf: 'center',
    fontFamily: 'Raleway-Regular',
  },
  
    
});


function mapStateToProps(state){
  return{
    compPage:state.Page.page,
    group_id:state.Page.group_id,
    userid:state.Page.userid,
    admin:parseInt(state.Page.admin),
  }
}

//export after connecting to redux
export default connect(mapStateToProps)(Tasks);
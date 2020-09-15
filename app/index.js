import React, { Component } from "react";   // Importing components from React.
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  FlatList,
  AsyncStorage,
  Button,
  TextInput,
  Keyboard,
  Platform
} from "react-native";                      // Importing components from React Native. 

const isAndroid = Platform.OS == "android"; // This indicates that this code will specificially be implemented 
                                            // on Android platforms.
const viewPadding = 10;                     // This gives some room around the screen so that the elements 
                                            // of the app isn't right against the border. 

export default class TodoList extends Component {    // This is the main class of this app.
  state = {                                          // A "state" is a type of data that allows change.
    tasks: [],                                       // An array named tasks will keep track of the list.
    text: ""                                         // A string called text will keep track of the inputted text.
  };

  changeTextHandler = text => {                      // This function deals with what the user has entered.
    this.setState({ text: text });                   // setState() schedules updates to the component.
  };

  addTask = () => {                                  // addTask is a function defined to add tasks. 
    let notEmpty = this.state.text.trim().length > 0; // 'let' lets us know that notEmpty is a variable that can change.
                                   // 'const,' used above, lets us know that the value of viewPadding will not change.
                                                      
    if (notEmpty) {                                  // If the user types something in,
      this.setState(
        prevState => {                               // changes will be based on the previous state.
          let { tasks, text } = prevState;
          return {
            tasks: tasks.concat({ key: tasks.length, text: text }), 
            text: ""
          };
        },
        () => Tasks.save(this.state.tasks)           // This saves the current state of the array.
      );
    }
  };

  deleteTask = i => {                                // deleteTask is a function defined to delete tasks. 
    this.setState(                                   // setState() schedules updates to the component.
      prevState => {
        let tasks = prevState.tasks.slice();         

        tasks.splice(i, 1);                          // This removes the selected element from the array.

        return { tasks: tasks };                     // This returns what is left.
      },
      () => Tasks.save(this.state.tasks)             // This saves the current state of the array.
    );
  };
                                                        // componentDidMount handles the event where the component mounts.
                                                        // If this component did mount, then execute the code within it.
  componentDidMount() {                                 // When you press the text box, a keyboard should appear.
    Keyboard.addListener(                                       // This detects whether a keyboard is being used or not.
      isAndroid ? "keyboardDidShow" : "keyboardWillShow",       // If isAndroid is true, then the keyboard will show, and
      e => this.setState({ viewMargin: e.endCoordinates.height + viewPadding }) // extra padding will be added.
    );

    Keyboard.addListener(
      isAndroid ? "keyboardDidHide" : "keyboardWillHide",       // If isAndroid is false, then the keyboard will hide, and
      () => this.setState({ viewMargin: viewPadding })          // the padding will be normal.
    );

    Tasks.all(tasks => this.setState({ tasks: tasks || [] }));  // This saves all of the tasks.
  }

  render() {                                          // render() loads the code to the platform.
    return (
      <View                                           // This builds a Containter View
        style={[styles.container, { paddingBottom: this.state.viewMargin }]} // Anything in this object will override
                                                                             // the styles.container.
      >
        <FlatList                                     // This makes our tasks list in a simple flat layout.
          style={styles.list}
          data={this.state.tasks}                     // This is our array of the tasks.
          renderItem={({ item, index }) =>
            <View                                     // This container specifies how to render each item.
            >                                    
              <View style={styles.listItemCont}
              >
                <Text style={styles.listItem}>        
                  {item.text}
                </Text>
                <Button title="X" onPress={() => this.deleteTask(index)} // This creates the [x] button that 
                                                                         // triggers the deletion of a task.
                />
              </View>
              <View style={styles.hr} />
            </View>}
        />
        <TextInput                                  // This part gets the user's input to add tasks.
          style={styles.textInput}
          onChangeText={this.changeTextHandler}     // When the text changes, call changeTextHandler().
          onSubmitEditing={this.addTask}            // When submitting a text change, call addTask().
          value={this.state.text}
          placeholder="Add Tasks"                   // The placeholder.
          returnKeyType="done"
          returnKeyLabel="done"
        />
      </View>
    );
  }
}

let Tasks = {
  convertToArrayOfObject(tasks, callback) {        // This method converts the tasks to an array of objects.
    return callback(
      tasks ? tasks.split("||").map((task, i) => ({ key: i, text: task })) : []
    );
  },
  convertToStringWithSeparators(tasks) {           // This method converts the tasks to a string with separators.
    return tasks.map(task => task.text).join("||");
  },
  all(callback) {                            // AsynStorage is a key-value storage system that is global to the app.
    return AsyncStorage.getItem("TASKS", (err, tasks) =>                              // getItem() fetches the data.
      this.convertToArrayOfObject(tasks, callback)
    );
  },
  save(tasks) {
    AsyncStorage.setItem("TASKS", this.convertToStringWithSeparators(tasks));         // setItem() stores the data.
  }                
};

const styles = StyleSheet.create({                  // Similar to CSS: StyleSheet dictates colors, layout, and fonts etc. 
  container: {                                      // Each of the elements on the app are labeled with an id, and 
    flex: 1,                                        // the styling components (such as the width, padding, etc.) will
    justifyContent: "center",                       // be applied to all elements with that id. 
    alignItems: "center", 
    backgroundColor: "#F5FCFF",                     // Write code as you would in CSS, with a few syntax changes like
    padding: viewPadding,                           // camelCasing and quotations.
    paddingTop: 20
  },
  list: {
    width: "100%"
  },
  listItem: {                                       // So, as an example, every listItem will have:
    paddingTop: 2,                                  // a padding of 2 on top, 
    paddingBottom: 2,                               // a padding of 2 on bottom, and
    fontSize: 18                                    // a font size of 18.
  },
  hr: {
    height: 1,
    backgroundColor: "gray"
  },
  listItemCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  textInput: {
    height: 40,
    paddingRight: 10,
    paddingLeft: 10,
    borderColor: "gray",
    borderWidth: isAndroid ? 0 : 1,
    width: "100%"
  }
});

AppRegistry.registerComponent("TodoList", () => TodoList); // AppRegistry is the JavaScript entry point to 
                                                           // run React Native apps. 

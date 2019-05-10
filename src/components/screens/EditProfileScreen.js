import React from "react";
import {
  Text,
  View,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  Keyboard
} from "react-native";

import {
  Card,
  CardItem,
  Button,
  Container,
  Header,
  Content,
  Form,
  Item,
  Input,
  Label,
  Textarea
} from "native-base";

import HeaderBar from "@molecules/HeaderBar";

export default class EditProfileScreen extends React.Component {
  render () {
    return (
      <View style={{flex: 1}}>
        <HeaderBar title="Edit Profile" navRight={<Button rounded small light><Text style={{paddingHorizontal: 10}}>Save</Text></Button>}/>
        <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
          <ScrollView >
            <Item floatingLabel>
              <Label>Given Name</Label>
              <Input />
            </Item>
            <Item floatingLabel>
              <Label>Surname</Label>
              <Input />
            </Item>
            <Item floatingLabel>
              <Label style={{lineHeight: 40, textAlignVertical: "top"}}>Description</Label>
              <Input multiline style={{paddingTop: 20}}/>
            </Item>
            <Item floatingLabel>
              <Label>Phone</Label>
              <Input/>
            </Item>
            <Item floatingLabel>
              <Label>Password</Label>
              <Input secureTextEntry/>
            </Item>
            {/* <Button full><Text>Submit</Text></Button> */}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

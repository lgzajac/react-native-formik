import React from "react";
import { compose } from "react-recompose";
import { Button, View } from "react-native";
import { mount } from "enzyme";

import { withNextInputAutoFocusForm, withNextInputAutoFocusInput } from "../..";
import withFormikMock from "../testUtils/withFormikMock";

const submitForm = jest.fn();

const Form = compose(
  withFormikMock({
    submitForm
  }),
  withNextInputAutoFocusForm
)(View);

const focusInput = jest.fn();
class TextInput extends React.PureComponent {
  focus() {
    focusInput(this.props.name);
  }

  render() {
    return null;
  }
}

const Input = withNextInputAutoFocusInput(TextInput);

console.error = jest.fn();

describe("withNextInputAutoFocus", () => {
  it("focuses next input and then submits", () => {
    const wrapper = mount(
      <Form>
        <Input name="first" />
        <View>
          <View name="not-focusable" />
          <Input name="second" />
        </View>
        <Input name="last" />
        <Button onPress={jest.fn()} title="SUBMIT" />
      </Form>
    );

    const firstInput = wrapper.find(TextInput).first();
    const secondInput = wrapper.find(TextInput).at(1);
    const lastInput = wrapper.find(TextInput).at(2);

    expect(firstInput.props().returnKeyType).toEqual("next");
    expect(secondInput.props().returnKeyType).toEqual("next");
    expect(lastInput.props().returnKeyType).toEqual("done");

    firstInput.props().onSubmitEditing();
    expect(focusInput).toHaveBeenCalledWith("second");
    secondInput.props().onSubmitEditing();
    expect(focusInput).toHaveBeenCalledWith("last");
    lastInput.props().onSubmitEditing();
    expect(focusInput).not.toHaveBeenCalledTimes(3);
    expect(submitForm).toHaveBeenCalled();
  });

  it("does not erase passed input props", () => {
    const onSubmitEditing = jest.fn();
    const wrapper = mount(
      <Form>
        <Input
          name="first"
          returnKeyType="correct value"
          onSubmitEditing={onSubmitEditing}
        />
      </Form>
    );

    const input = wrapper.find(TextInput).first();

    expect(input.props().returnKeyType).toEqual("correct value");
    input.props().onSubmitEditing();
    expect(submitForm).toHaveBeenCalled();
    expect(onSubmitEditing).toHaveBeenCalled();
  });
});

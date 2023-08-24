import React from "react";
import { compose } from "react-recompose";
import { TextInput } from "react-native";
import { mount } from "enzyme";

import { setFormikInitialValue } from "../..";
import withFormikMock from "../testUtils/withFormikMock";

console.error = jest.fn();

let setFieldValue;
let Input;

beforeEach(() => {
  setFieldValue = jest.fn();

  const formikContext = {
    setFieldValue,
    values: {
      "this input has been set by formik": "set value"
    }
  };

  Input = compose(
    withFormikMock(formikContext),
    setFormikInitialValue
  )(TextInput);
});

describe("setFormikInitialValue", () => {
  it("sets the initial value to ''", () => {
    mount(<Input name="inputName" />);
    expect(setFieldValue).toBeCalledWith("inputName", "");
  });

  it("keeps other props", () => {
    const wrapper = mount(<Input name="inputName" someProp="someValue" />);
    expect(wrapper.find(TextInput).props().someProp).toEqual("someValue");
  });

  it("does not set initial value if set by formik, e.g. with initial values", () => {
    mount(<Input name="this input has been set by formik" />);
    expect(setFieldValue).not.toBeCalled();
  });
});

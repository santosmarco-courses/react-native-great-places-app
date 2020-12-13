import React from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import {
  HeaderButtons,
  HeaderButton,
  Item,
} from "react-navigation-header-buttons";

const SimplifiedHeaderButton = ({
  title,
  iconName,
  iconColor,
  onPress,
  disabled,
  disabledIconColor,
}) => {
  return (
    <HeaderButtons
      HeaderButtonComponent={(props) => (
        <HeaderButton
          IconComponent={FontAwesome5}
          iconSize={23}
          color={
            disabled
              ? disabledIconColor
                ? disabledIconColor
                : "gray"
              : iconColor
          }
          {...props}
        />
      )}
    >
      <Item
        title={title}
        iconName={iconName}
        onPress={disabled ? null : onPress ? onPress : null}
      />
    </HeaderButtons>
  );
};

export default SimplifiedHeaderButton;

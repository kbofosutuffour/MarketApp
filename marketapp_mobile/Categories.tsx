import React, {useEffect, useState, useContext} from 'react';
import vehicles from './media/categories/Vehicles-96.png';
import food from './media/categories/Food-96.png';
import clothes from './media/categories/Clothes-96.png';
import entertainment from './media/categories/Entertainments-96.png';
import free_stuff from './media/categories/Free_stuff-96.png';
import furniture from './media/categories/Furniture-96.png';
import hobbies from './media/categories/Hobbies-96.png';
import book from './media/categories/Book-96.png';
import dorm_goods from './media/categories/Dorm_goods-96.png';
import supplies from './media/categories/Office_Supplies-96.png';
import misc from './media/categories/Misc-96.png';
import wm_logo from './media/categories/wm_logo.jpg';
import {
  View,
  TouchableWithoutFeedback,
  Image,
  Text,
  StyleSheet,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

/**
 * Component that displays all of the possible categories for a post.
 * Shown when the user is performing a search or creating a new post
 * @returns All possible categories for a post
 */
export function Categories(props: any): JSX.Element {
  const categories: any = {
    Furniture: furniture,
    Clothing: clothes,
    'Free Stuff': free_stuff,
    Vehicles: vehicles,
    'W&M Merch': wm_logo,
    Hobbies: hobbies,
    'Office Supplies': supplies,
    'Dorm Goods': dorm_goods,
    Food: food,
    Entertainment: entertainment,
    'Books': book,
    'Misc.': misc,
  };

  return (
    <View style={styles.category}>
      {Object.keys(categories).map(value => {
        return (
          <>
            <TouchableWithoutFeedback
              onPress={() => {
                // Use different functions depending on if user is on the home screen
                // or the New/Edit Post screen

                if (props.newPost) {
                  props.setPost({...props.post, category: value.toUpperCase()});
                  props.showCategory(false);
                } else {
                  props.setCategory(value);
                }
              }}>
              <View
                style={
                  props.category === value
                    ? styles.categoryItemSelected
                    : styles.categoryItem
                }>
                <Image source={categories[value]} />
                <Text>{value}</Text>
              </View>
            </TouchableWithoutFeedback>
          </>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  category: {
    backgroundColor: 'white',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 10,
    rowGap: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  categoryItem: {
    backgroundColor: Colors.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    padding: 10,
  },
  categoryItemSelected: {
    backgroundColor: Colors.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    padding: 5,
    borderWidth: 5,
    borderColor: 'rgb(185, 151, 91)',
  },
});

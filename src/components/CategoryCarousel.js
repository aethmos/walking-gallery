import Carousel from "./Carousel";
import React, {Component} from 'react';
import PropTypes from 'prop-types';

class CategoryCarousel extends Component {
    render() {
        let {categories, thumbnails} = this.props;

        let cats = [];
        for (let j = 0; j < categories.length; j++) {
            for (let i = 0; i < thumbnails.length; i++) {
                let image = thumbnails[i];
                if (image.relativeDirectory === categories[j].relativeDirectory) {
                    cats.push({...categories[j], thumbnail: {...image}});
                    break;
                }
            }
        }

        return (
            <Carousel items={cats.map((value, index) => {
                return {...value, index: index, image: value.thumbnail}
            })}/>
        )
    }
}

CategoryCarousel.propTypes = {
    categories: PropTypes.array,
    thumbnails: PropTypes.array
};

export default CategoryCarousel;

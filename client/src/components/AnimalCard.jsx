import React from 'react'
import { Image } from "@chakra-ui/react";


const AnimalCard = (props) => {
    const newAnimalType = props.animalType;
  return (
    <Image w={150} h={150} src={`images/${newAnimalType}.png`} alt="AnimalCard" />
  )
}

export default AnimalCard
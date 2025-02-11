import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Admonition from '@theme-original/Admonition';
import IconArrow from '@theme/Icon/Arrow';
import { FaRegLightbulb } from 'react-icons/fa';
import { RiProgress3Line } from 'react-icons/ri';
import { IoMdCheckboxOutline } from 'react-icons/io';
import { FaTrello } from 'react-icons/fa';

const BOARD_ID = 'HkLLMYYU';

const TRELLO_API_CARDS = `https://api.trello.com/1/boards/${BOARD_ID}/cards`;
const TRELLO_API_LISTS = `https://api.trello.com/1/boards/${BOARD_ID}/lists`;

export default function TrelloRoadmap() {
  const [cards, setCards] = useState([]);
  const [lists, setLists] = useState([]);

  useEffect(() => {
    axios
      .get(TRELLO_API_CARDS)
      .then((response) => {
        setCards(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get(TRELLO_API_LISTS)
      .then((response) => {
        setLists(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <style>
        .card > div > span {
          
        }
      </style>
      {lists.map((list) => {
        if (list.name === 'Bugs') {
          return;
        }
        return (
          <List key={list.id} title={list.name} type={list.name}>
            {cards
              .filter((card) => card.idList === list.id)
              .map((card) => (
                <Card {...card}></Card>
              ))}
          </List>
        );
      })}
    </div>
  );
}

export function List(props) {
  let list = ['done', 'in progress', 'ideas'];
  let type = ['note', 'warning', 'info'];
  let icons = [
    <IoMdCheckboxOutline />,
    <RiProgress3Line />,
    <FaRegLightbulb />,
  ];
  return (
    <Admonition
      title={props.title}
      type={type[list.indexOf(props.type.toLowerCase())]}
      icon={icons[list.indexOf(props.type.toLowerCase())]}
    >
      {props.children}
    </Admonition>
  );
}

// Define a mapping of label colors to CSS colors
const labelColors = {
  blue_light: '#CCE0FF',
  purple_light: '#DFD8FD',
  lime_light: '#D3F1A7',
  green_light: '#BAF3DB',
  yellow_light: '#F8E6A0',
  orange_light: '#FFA500',
  red_light: '#F9D5D3',
  pink_light: '#F9D0EC',
  sky_light: '#C6EDFB',
  red_dark: '#C9372D',
  sky_dark: '#0C6C8F',
  // Add more mappings as needed
};

export function Card(props) {
  // Replace \n with <br> in the description
  const descLines = props.desc.split('\n');

  // Trim the description to the first 3 lines
  let trimmedDesc = descLines.slice(0, 2).join('<br>');

  // Add ... if there are more than 3 lines
  if (descLines.length > 2) {
    trimmedDesc += `<br>&nbsp;&nbsp;&nbsp;<a href="${props.shortUrl}">continued in Trello...</a>`;
  }
  return (
    <Admonition title={props.name} type="note" icon={null} className='trello-card'>
      <div style={{ paddingLeft: 5 }}>
        {/* {trimmedDesc && (
          <p
            style={{
              maxHeight: 80,
              overflow: 'hidden',
              marginLeft: 10,
              marginBottom: 0,
            }}
            dangerouslySetInnerHTML={{ __html: trimmedDesc }}
          />
        )} */}

        {/* <pre>{JSON.stringify(props, null, 2)}</pre> */}
        </div>
        {/* <div style={{
          paddingLeft: 5,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}> */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            flex: 1
          }}>
            {props.labels &&
              props.labels.map((label) => (
                <Pill
                  key={label.id}
                  isDark={['red_dark', 'sky_dark'].includes(label.color)}
                  color={
                    labelColors[label.color]
                      ? labelColors[label.color]
                      : `light grey`
                  } // Pass the color to the Pill component
                >{label.name}</Pill>
              ))}
              <Pill
                isDark={false}
                color='white'
                style={{ alignItems: '', backgroundColor: '#ffffff00', textAlign: 'right', flexGrow:1, paddingRight:0 }}
                // Pass the color to the Pill component
              >
                <a href={props.shortUrl}>Open in Trello</a>
                &nbsp;
                <a href={props.shortUrl}><FaTrello style={{ paddingTop: 1 }} /></a>
            </Pill>
          </div>
            
        {/* </div> */}
    </Admonition>
  );
}

function Pill(props) {
  return (
    <div
      className="tag"
      style={{
        backgroundColor: props.color,
        color: props.isDark ? 'white' : 'black',
        fontSize: '0.9em',
        display: 'inline-block',
        padding: '2px 10px',
        margin: '5px',
        borderRadius: '20px',
        ...props.style
      }}
    >
      {props.children}
    </div>
  );
}

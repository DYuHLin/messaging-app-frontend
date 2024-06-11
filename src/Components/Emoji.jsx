import React from 'react'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

function Emoji({hidden, content, setContent, setEmoji}) {

    const addEmoji = (e) => {
        const sym = e.unified.split('_');
        const emoteArray = [];
        sym.forEach((el) => emoteArray.push('0x' + el));
        let emoji = String.fromCodePoint(...emoteArray);
        setContent(content + emoji);
        setEmoji(true);
    };

  return (
    <div className={`emoji-container ${hidden == true ? 'hidden' : ''}`}>
    <Picker data={data} onEmojiSelect={addEmoji} theme='dark'/>
    </div>
  )
}

export default Emoji
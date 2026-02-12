import React from 'react'
import Script from 'next/script'

const TestPage = () => {
  return (
    <div>
        <Script src="http://localhost:3000/widget.js" data-id="4411812a-a444-4c66-a511-6de8725b96dd" defer ></Script>
    </div>
  )
}

export default TestPage
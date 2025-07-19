import React from 'react'
/***
 * 
 * TODO: DELETE
 * 
 */
// Define the type for the component's props
interface ShowJSONDisplayProps {
  data: any // Use a more specific type (e.g., TTMDBShow) if available
}

const ShowJSONDisplay: React.FC<ShowJSONDisplayProps> = ({ data }) => {
  return (
    <pre
      className="
      mt-16
        max-w-full          /* Ensures the pre tag does not exceed parent width */
        whitespace-pre-wrap /* Allows long lines to wrap instead of overflowing */
        overflow-x-auto     /* Adds horizontal scroll if wrapping is not enough */
        p-4                 /* Adds padding inside the pre tag */
        bg-gray-900         /* Light gray background for readability */
        rounded-lg          /* Rounded corners for aesthetics */
        text-left           /* Ensures text aligns to the left */
        text-sm             /* Smaller font size for dense data */
        font-mono           /* Monospaced font for code/JSON */
      "
    >
      {JSON.stringify(data, null, 2)}
    </pre>
  )
}

export default ShowJSONDisplay

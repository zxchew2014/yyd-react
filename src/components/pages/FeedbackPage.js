import React from 'react';
import { Link } from 'react-router-dom';

const FeedbackPage = () => (
  <div>
    <Link to="/">Home</Link>
    <br />
    <iframe
      src="https://docs.google.com/forms/d/e/1FAIpQLSf52w13YKsyslT3V8nKjjZnSoObiGsivdmfiuDDANAo_OJBEA/viewform?embedded=true"
      width="500"
      height="1000"
      frameBorder="0"
      marginHeight="0"
      marginWidth="0"
    >
      Loading...
    </iframe>
  </div>
);

export default FeedbackPage;

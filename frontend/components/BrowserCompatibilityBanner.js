export default () => (
  <div id="outdated">
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        'background-color': 'rgba(255, 255, 255, 0.4)',
      }}
    />
    <div
      style={{
        'background-color': '#5f249f',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      }}
    >
      <h6>Your Browser Is Not Supported</h6>
      <p style={{ 'text-transform': 'none', 'font-size': '14px' }}>
        Please try another browser to improve your experience and security.
        <a id="btnUpdateBrowser" style={{ display: 'none' }}>
          {' '}
          Learn More{' '}
        </a>
      </p>
      <p className="last" style={{ display: 'none' }}>
        <a id="btnCloseUpdateBrowser" title="Close">
          &times;
        </a>
      </p>
    </div>
  </div>
);

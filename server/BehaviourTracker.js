export const useBehaviorTracker = () => {
  const logInteraction = (eventType, payload) => {
    const eventData = {
      eventType,
      payload,
      timestamp: new Date().toISOString(),
      sessionId: sessionStorage.getItem('js_session_id') || 'guest_session',
    };

    // Store locally for immediate AI inference
    const history = JSON.parse(localStorage.getItem('jp_behavior_profile') || '[]');
    history.push(eventData);
    localStorage.setItem('jp_behavior_profile', JSON.stringify(history.slice(-50))); // Keep last 50 events

    console.log('[Tracking Event]:', eventData);
  };

  return { logInteraction };
};
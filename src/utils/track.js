export function trackLogin() {
  try {
    window.uetq = window.uetq || []
    window.uetq.push('event', 'login', {'event_category': 'login'})
    // window.UET && window.UET('event', 'login', {'event_category': 'login'});
  } catch (e) {
    console.log(e)
  }

}

export function trackOrder(id, orderId, price) {
  try {
    window.uetq = window.uetq || []
    window.uetq.push('event', 'purchase', {
      'event_category': 'purchase',
      'event_label': `${orderId}${id}`,
      'event_value': price
    })
    // window.UET && window.UET('event', 'purchase', {
    //   'event_category': 'purchase',
    //   'event_label': `${orderId}${id}`,
    //   'event_value': price
    // });
  } catch (e) {
    console.log(e)
  }
}
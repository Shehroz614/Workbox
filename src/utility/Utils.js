import moment from 'moment'

// ** Checks if an object is empty (returns boolean)
export const isObjEmpty = obj => Object.keys(obj).length === 0

// ** Returns K format from a number
export const kFormatter = num => (num > 999 ? `${(num / 1000).toFixed(1)}k` : num)

// ** Converts HTML to string
export const htmlToString = html => html.replace(/<\/?[^>]+(>|$)/g, '')

// ** Checks if the passed date is today
const isToday = date => {
  const today = new Date()
  return (
    /* eslint-disable operator-linebreak */
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
    /* eslint-enable */
  )
}

/* EXTRACTS FILENAME FROM CONTENT DISPOSITION HEADER */
export function extractFilename(contentDisposition) {
  const regex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
  const matches = regex.exec(contentDisposition);
  let filename = 'unknown';
  if (matches != null && matches[1]) {
    filename = matches[1].replace(/['"]/g, '');
  }
  return filename;
}

/**
 ** Format and return date in Humanize format
 ** Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 ** Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */
export const formatDate = (value, formatting = { month: 'short', day: 'numeric', year: 'numeric' }) => {
  if (!value) return value
  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

// ** Returns short month of passed date
export const formatDateToMonthShort = (value, toTimeForCurrentDay = true) => {
  const date = new Date(value)
  let formatting = { month: 'short', day: 'numeric' }

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { hour: 'numeric', minute: 'numeric' }
  }

  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

/**
 ** Return if user is logged in
 ** This is completely up to you and how you want to store the token in your frontend application
 *  ? e.g. If you are using cookies to store the application please update this function
 */
export const isUserLoggedIn = () => localStorage.getItem('userData')
export const getUserData = () => JSON.parse(localStorage.getItem('userData'))

/**
 ** This function is used for demo purpose route navigation
 ** In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 ** Please note role field is just for showing purpose it's not used by anything in frontend
 ** We are checking role just for ease
 * ? NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */
export const getHomeRouteForLoggedInUser = role => {
  if (role?.id || role?.roleName)
  {
    return "/"+import.meta.env.VITE_DEFAULT_ROUTE
  }
  return `/login`
}

// ** React Select Theme Colors
export const selectThemeColors = theme => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: '#7367f01a', // for option hover bg-color
    primary: '#7367f0', // for selected option bg-color
    neutral10: '#7367f0', // for tags bg-color
    neutral20: '#ededed', // for input border-color
    neutral30: '#ededed' // for input hover border-color
  }
})


// Returns token expiry time

export const tokenExpiryTime = (time) => {
  if(time){
    return moment.utc(time).format()
  }else{
    return null
  }
}

// Returns current time

export const currentDateTime = () => {
  return moment().utc().format()
}

// Returns if tokenExpiryTime is Reached
export const hasTokenExpired = (time) => {
  if(moment.utc().isSameOrAfter(moment.utc(time))){
    return true
  }else{
    return false
  }
}

// Prevent Input field to accept minus value

export const preventMinus = (e) => {
  if (e.code === 'Minus' || e.code === 'KeyE') {
      e.preventDefault();
  }
};

// Prevent Input field to accept pasted minus value

export const preventPasteNegative = (e) => {
  const clipboardData = e.clipboardData || window.clipboardData;
  const pastedData = parseFloat(clipboardData.getData('text'));

  if (pastedData < 0) {
      e.preventDefault();
  }
};


// Format date

export const customFormatDate = (date) => {
  const formatType = 'USA';

  if(formatType == 'USA'){
    return date ? moment(date).format("MM-DD-YYYY") : 'mm-dd-yyyy';
  }else if(formatType == 'UK'){
    return date ? moment(date).format("DD-MM-YYYY") : 'dd-mm-yyyy';
  }else{
    return date ? moment(date).format("YYYY-MM-DD") : 'yyyy-mm-dd';
  }
}

// Format time
export const customFormatTime = (time) => {
  const formatType = 'USA';

  if(formatType == 'USA'){
    return time ? moment(time, "HH:mm").format("hh:mm a") : 'hh:mm a';
  }else if(formatType == 'UK'){
    return time ? moment(time, "HH:mm").format("hh:mm a") : 'hh:mm a';
  }else{
    return time ? moment(time, "HH:mm").format("hh:mm a") : 'hh:mm a';
  }
}

// Format date time
export const customFormatDateTime = (dateTime) => {
  const formatType = 'USA';

  if(formatType == 'USA'){
    return dateTime ? moment(dateTime).format("MM-DD-YYYY hh:mm a") : 'mm-dd-yyyy hh:mm a';
  }else if(formatType == 'UK'){
    return dateTime ? moment(dateTime).format("DD-MM-YYYY hh:mm a") : 'dd-mm-yyyy hh:mm a';
  }else{
    return dateTime ? moment(dateTime).format("YYYY-MM-DD hh:mm a") : 'yyyy-mm-dd hh:mm a';
  }
}

// Format today date
export const todayDate = () => {
  const formatType = 'USA';

  if(formatType == 'USA'){
    return moment().format("MM-DD-YYYY");
  }else if(formatType == 'UK'){
    return moment().format("DD-MM-YYYY");
  }else{
    return moment().format("YYYY-MM-DD");
  }
}

// Format today date time

export const todayDateTime = () => {
  const formatType = 'USA';

  if(formatType == 'USA'){
    return moment().format("MM-DD-YYYY hh:mm a");
  }else if(formatType == 'UK'){
    return moment().format("DD-MM-YYYY hh:mm a");
  }else{
    return moment().format("YYYY-MM-DD hh:mm a");
  }
}

// Format date in text form
export const customFormatDateInTextForm = (date) => {
  return date ? moment(date).format("MMM D, YYYY") : '';
}

export const customNavigate = {navigate: null}
export const customDispatch = {dispatch: null}
export const customToken = {token: null}


export function getTimeToDisplay(date) {
  const currentDate = new Date();
  const commentDate = new Date(date);

  const timeDifference = currentDate - commentDate;
  const secondsDifference = Math.floor(timeDifference / 1000);
  const minutesDifference = Math.floor(secondsDifference / 60);
  const hoursDifference = Math.floor(minutesDifference / 60);
  const daysDifference = Math.floor(hoursDifference / 24);

  if (secondsDifference < 60) {
    return `${secondsDifference} sec${secondsDifference !== 1 ? 's' : ''} ago`;
  } else if (minutesDifference < 60) {
    return `${minutesDifference} min${minutesDifference !== 1 ? 's' : ''} ago`;
  } else if (hoursDifference < 24 && commentDate.getDate() === currentDate.getDate()) {
    const hours = commentDate.getHours();
    const minutes = commentDate.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  } else if (daysDifference < 1) {
    return 'Today';
  }  else {
    return `${daysDifference} day${daysDifference !== 1 ? 's' : ''} ago`;
  }
}

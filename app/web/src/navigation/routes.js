export const ROUTES = {
    HOME_PAGE: '/',
    SIGN_UP_PAGE: '/sign-up',
    SIGN_IN_PAGE: '/sign-in',
    CONFIRM_EMAIL_PAGE: '/confirm-email',
    RESET_PASSWORD_PAGE: '/reset-password',
    CHARACTERS_PAGE: '/characters',
    LOCATIONS_PAGE: '/locations',
    WORKS_PAGE: '/works',
    USER_DETAIL_PAGE: '/user',
    CHARACTER_DETAILS_PAGE: '/characters/:id',
    LOCATION_DETAILS_PAGE: '/locations/:id',
    WORK_DETAILS_PAGE: '/works/:id',
    WORK_DASHBOARD_PAGE: '/works/:id/dashboard',
    LOCATION_IN_WORK_DETAILS_PAGE: '/works/:id/location-links/:locationInWorkId',
    CHARACTER_IN_WORK_DETAILS_PAGE: '/works/:id/cast/:characterInWorkId',
    EVENT_DETAILS_PAGE: '/works/:id/events/:eventId',
    RELATIONSHIP_DETAILS_PAGE: '/works/:id/cast/:characterInWorkId/relationships/:relationshipId',
    NOT_FOUND_PAGE: '*',
};

export default ROUTES;

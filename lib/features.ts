// Switch for the content-management features (notice board, and later events,
// gallery, etc.). Off unless ENABLE_ADMIN=true is set in the environment, so
// unfinished admin work can be merged without changing the live site.
export function contentEnabled() {
  return process.env.ENABLE_ADMIN === "true";
}

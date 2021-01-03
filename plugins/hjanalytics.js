

export default async ({ app }) => {
  app.router.afterEach(async(to, from) => {
    if (process.env.NODE_ENV !== 'production')
      return;

    console.log("Requesting to bot");
    app.$axios.post('http://server.hamedj.ir:2688/BotGateway/Log',
      `logLevel=BlogVisit&logText=${to.fullPath}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
  )
  });
}

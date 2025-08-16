Forket().then((forket) => {
  app.use('/@forket/something', forket.forketServerActions());
  app.use('/@forket', forket.forketServerActions());
});

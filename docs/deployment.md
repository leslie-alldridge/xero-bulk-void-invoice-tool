## Deployment

### UAT

1. Using the heroku cli push your current branch e.g. `git push heroku yourbranch:master`
2. App URL is here: https://bulkvoiduat.herokuapp.com/void
3. Once testing is complete, move to production deployment

### Production

1. Push changes to master on GitHub
2. `git push heroku master`
3. View changes over on https://bulkvoidxero.herokuapp.com/

### Future considerations

- Automatic testing and deployments via GitHub Actions or similar
- Local test suite
- Better handling API requests using jobs instead of long running HTTP requests

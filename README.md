# naloxone-exchange-lambdas
Repository for lambdas. The goal here was to create separate packages for each lambda, but they share a lot of common code. This package should be three packages: a library with shared classes and the run specific logic for each lambbda.

## Targets
Using the `zip` npm target you can output the required lambda zip. There are two lambda targets in the zip:

`/dist/lambda/email/index.handler`
`/dist/lambda/slack/index.handler`

## Environment Variables
Required environment variables for each lambda.

### Shared by Email and Slack
`DOMAIN`: Domain the metric will be published with, i.e. integ.naloxoneexchange.com
`METRIC_NAME`: Name of the metric, i.e. BusinessEmailNotification
`METRIC_NAMESPACE`: Metric namespace, i.e. Orders
`STAGE`: State of the metric, i.e. Integ or Prod.

### Slack
In addition to the above, the slack notifier requires the following environment variables.
`CHANNEL_URI`: URI of the slack channel, everything after hostname, i.e. /services/<UUID>
`CHANNEL_HOST_NAME`: Slack host name, i.e. hooks.slack.com
# SLO — <service> · <user journey>

Owner:        <team>
SLI:          proportion of valid requests served < 300 ms with a 2xx/3xx
Measurement:  <source — e.g. Datadog APM / load-balancer logs>
Window:       rolling 30 days

Target:       99.9%
Error budget: 0.1%   (~43 min / 30 days)

Alerting (multi-window burn-rate):
  - page     14.4x over 1h    /   6x over 6h
  - ticket    3x  over 1d     /   1x over 3d

Exclusions:   planned maintenance windows
Review:       monthly, with the error-budget policy

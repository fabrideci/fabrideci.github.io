# Terraform module — production-readiness checklist

  [ ] README with inputs, outputs, and a usage example
  [ ] examples/ directory that `terraform plan`s cleanly
  [ ] Provider and module versions pinned
  [ ] No hardcoded secrets — values via variables / key vault
  [ ] Required vs optional inputs are obvious; sane defaults
  [ ] fmt + validate + tflint + trivy (security) run in CI
  [ ] Consistent tags / labels on every resource
  [ ] Remote state backend + locking configured
  [ ] Idempotent — a second apply shows no changes
  [ ] CHANGELOG + semver tag on release

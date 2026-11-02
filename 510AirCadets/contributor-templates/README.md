# Fictional content templates

These files are examples, not confirmed squadron activities. Keep originals here, outside the published content directories. Copy one into the correct folder and replace the sample values with reviewed public information.

- `event.json` has date `2027-01-19`. Example destination: `../content/events/2027/01/2027-01-19-example.json`.
- `announcement.json` has publication date `2027-01-12`. Example destination: `../content/announcements/2027/01/2027-01-12-example.json`. Its expiry does not determine its folder.

Choose a unique stable id for each new item. Ids do not need to match filenames. If rescheduling the example event to `2027-02-03`, move it to `../content/events/2027/02/2027-02-03-example.json`, update its date/status/update date, and KEEP its original id. Remove the old source file in that same change. References continue to use the stable id.

For an announcement correction, retain the publication date, id and source folder unless the publication date itself was wrong. See [the contribution guide](../CONTRIBUTING.md) for GitHub web editing, PR review, validation errors and public-information safeguards. All submitted content and Git history are public.

Every event requires exactly one approved `category` string. The fictional event template uses `training` as an example, not an application default. Choose the appropriate category for the real activity; the application supplies labels, colours and symbols. The [contribution guide](../CONTRIBUTING.md) lists all ten accepted values. Announcement category values are unchanged.

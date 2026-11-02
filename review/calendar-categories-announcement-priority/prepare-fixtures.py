"""Create an isolated site with fictional QA content; never writes source content."""
import json
import pathlib
import shutil
import sys

source = pathlib.Path(sys.argv[1]).resolve()
target = pathlib.Path(sys.argv[2]).resolve()
if target.exists() or target == source or source in target.parents:
    raise SystemExit('Choose a new, nonexistent temporary directory outside the repository.')
shutil.copytree(source, target, ignore=shutil.ignore_patterns('node_modules', 'build', '.docusaurus'))
# Copy dependencies separately with cp -a --reflink=auto; do not symlink them.
categories = ['training', 'training', 'training', 'marksmanship', 'band', 'choir',
              'ground-school', 'ceremony', 'parade', 'field-training-exercise', 'special-event', 'biathlon']
events = target / 'content/events/2027/01'
events.mkdir(parents=True, exist_ok=True)
for i, category in enumerate(categories):
    item = dict(id=f'event-fictional-category-{i:02}', title=f'Fictional {category} example {i+1}',
                date='2027-01-19', category=category, status=['cancelled', 'updated', 'scheduled'][i % 3],
                description='Fictional review fixture only. Not a squadron activity.')
    if item['status'] != 'scheduled':
        item['updatedDate'] = '2027-01-18'
    (events / f'2027-01-19-example-{i:02}.json').write_text(json.dumps(item))
announcements = target / 'content/announcements/2027/01'
announcements.mkdir(parents=True, exist_ok=True)
for i, date in enumerate(['2027-01-18', '2027-01-19', '2027-01-20']):
    item = dict(id=f'announcement-fictional-notice-{i}', title=f'Fictional notice {i}',
                publicationDate=date, message='Fictional review notice only. Not public instructions.',
                expiryDate='2027-01-19' if i < 2 else '2027-01-21')
    (announcements / f'{date}-example.json').write_text(json.dumps(item))
print(target)

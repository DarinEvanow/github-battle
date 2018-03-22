import React from 'react';
import PropTypes from 'prop-types';
import Loading from './Loading';
import { fetchPopularRepos } from '../utils/api';

function SelectLanguage ({ selectedLanguage, onSelect }) {
  const languages = ['All', 'JavaScript', 'Ruby', 'Java', 'CSS', 'Python'];

  return (
    <ul className='languages'>
      {languages.map((language) => (
        <li
          style={language === selectedLanguage ? {color: '#d0021b'} : null}
          onClick={() => onSelect(language)}
          key={language}>
          {language}
        </li>
      ))}
    </ul>
  )
}

SelectLanguage.propTypes = {
  selectedLanguage: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired
}

function RepoGrid ({ repos }) {
  return (
    <ul className='popular-list'>
      {repos.map(({ name, owner, stargazers_count, html_url }, index) => (
        <li key={name} className='popular-item'>
          <div className='popular-rank'>#{index + 1}</div>
          <ul className='space-list-items'>
            <li>
              <img
                className='avatar'
                src={owner.avatar_url}
                alt={'Avatar for ' + owner.login}
              />
            </li>
            <li><a href={html_url}>{name}</a></li>
            <li>@{owner.login}</li>
            <li>{stargazers_count} stars</li>
          </ul>
        </li>
      ))}
    </ul>
  )
}

RepoGrid.propTypes = {
  repos: PropTypes.array.isRequired,
}

class Popular extends React.Component {
  state = {
    selectedLanguage: 'All',
    repos: null,
  }

  updateLanguage = async (language) => {
    this.setState(() => ({
        selectedLanguage: language,
        repos: null,
      }));

    const repos = await fetchPopularRepos(language);
    this.setState(() => ({ repos }));
  }

  componentDidMount() {
    this.updateLanguage(this.state.selectedLanguage);
  }

  render() {
    const { selectedLanguage, repos } = this.state;

    return (
      <div>
        <SelectLanguage
          selectedLanguage={selectedLanguage}
          onSelect={this.updateLanguage}
        />
        {!repos
          ? <Loading />
          : <RepoGrid repos={repos} />
        }
      </div>
    );
  }
}

export default Popular;
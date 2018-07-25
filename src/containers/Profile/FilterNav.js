import React from 'react';
import styles from './FilterNav.module.scss';
import { Search, Text, Button, Checkbox, SearchSelect } from 'components';
import {
  rootBountiesSelector,
  bountiesCategoryFiltersSelector,
  anyStageFiltersSelected,
  anyDifficultyFiltersSelected
} from 'public-modules/Bounties/selectors';
import { categoriesSelector } from 'public-modules/Categories/selectors';
import { throttle } from 'lodash';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { LoadComponent } from 'hocs';
import { actions } from 'public-modules/Bounties';
import { actions as categoryActions } from 'public-modules/Categories';
const {
  resetFilters,
  setSearch,
  toggleStageFilter,
  toggleDifficultyFilter,
  addCategoryFilter,
  removeCategoryFilter
} = actions;
const { loadCategories } = categoryActions;

const FilterNavComponent = props => {
  const {
    search,
    resetFilters,
    setSearch,
    toggleStageFilter,
    toggleDifficultyFilter,
    stageFilters,
    difficultyFilters,
    anyStageFiltersSelected,
    anyDifficultyFiltersSelected,
    categories,
    categoryFilters,
    addCategoryFilter,
    removeCategoryFilter
  } = props;

  return (
    <div className={styles.filterNav}>
      <div className={styles.refineWrapper}>
        <Text inline typeScale="h4" weight="fontWeight-medium">
          Refine By
        </Text>
        <Button
          type="link"
          className={styles.clearButton}
          onClick={resetFilters}
        >
          Clear Filters
        </Button>
      </div>
      <div className={styles.stageFilter}>
        <Text weight="fontWeight-medium" className={styles.groupText}>
          Stage
        </Text>
        <Checkbox
          label="Active"
          onChange={() => toggleStageFilter('active')}
          checked={stageFilters.active}
        />
        <Checkbox
          label="Completed"
          onChange={() => toggleStageFilter('completed')}
          checked={stageFilters.completed}
        />
        <Checkbox
          label="Expired"
          onChange={() => toggleStageFilter('expired')}
          checked={stageFilters.expired}
        />
        <Checkbox
          label="Dead"
          onChange={() => toggleStageFilter('dead')}
          checked={stageFilters.dead}
        />
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  const bountyState = rootBountiesSelector(state);

  return {
    stageFilters: bountyState.stageFilters,
    anyStageFiltersSelected: anyStageFiltersSelected(state),
    anyDifficultyFiltersSelected: anyDifficultyFiltersSelected(state),
    difficultyFilters: bountyState.difficultyFilters,
    categoryFilters: bountiesCategoryFiltersSelector(state),
    categories: categoriesSelector(state),
    search: bountyState.search
  };
};

const FilterNav = compose(
  connect(
    mapStateToProps,
    {
      setSearch,
      toggleStageFilter,
      toggleDifficultyFilter,
      addCategoryFilter,
      removeCategoryFilter,
      resetFilters,
      load: loadCategories
    }
  ),
  LoadComponent('')
)(FilterNavComponent);

export default FilterNav;

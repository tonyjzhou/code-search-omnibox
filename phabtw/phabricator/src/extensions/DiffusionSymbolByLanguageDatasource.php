<?php

final class DiffusionSymbolByLanguageDatasource
  extends PhabricatorTypeaheadDatasource {

  public function isBrowsable() {
    // This is slightly involved to make browsable, and browsing symbols
    // does not seem likely to be very useful in any real software project.
    return false;
  }

  public function getBrowseTitle() {
    return pht('Browse Symbols');
  }

  public function getPlaceholderText() {
    return pht('Type a symbol name...');
  }

  public function getDatasourceApplicationClass() {
    return 'PhabricatorDiffusionApplication';
  }

  public function loadResults() {
    $viewer = $this->getViewer();
    $searchTerm = $this->getRawQuery();
    $language = $this->getQuery();

    $results = array();

    if (strlen($searchTerm)) {
      $symbols = id(new DiffusionSymbolQuery())
        ->setViewer($viewer)
        ->setNamePrefix($searchTerm)
        ->setLimit(400)
        ->needRepositories(true)
        ->needPaths(true)
	      ->setLanguage($language)
        ->execute();
      foreach ($symbols as $symbol) {
        $lang = $symbol->getSymbolLanguage();
        $name = $symbol->getSymbolName();
        $type = $symbol->getSymbolType();
        $repo = $symbol->getRepository()->getName();

        $results[] = id(new PhabricatorTypeaheadResult())
          ->setName($name)
          ->setURI($symbol->getURI())
          ->setPHID(md5($symbol->getURI())) // Just needs to be unique.
          ->setDisplayName($name)
          ->setDisplayType(strtoupper($lang).' '.ucwords($type).' ('.$repo.')')
          ->setPriorityType('symb')
          ->setImageSprite(
            'phabricator-search-icon phui-font-fa phui-icon-view fa-code '.
            'lightgreytext');
      }
    }

    return $results;
  }

}
